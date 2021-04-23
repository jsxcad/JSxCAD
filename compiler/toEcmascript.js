import { generate } from './astring.js';
import hash from 'object-hash';
import { parse } from 'acorn/dist/acorn.mjs';
import { read } from '@jsxcad/sys';
import { recursive } from 'acorn-walk/dist/walk.mjs';

export const strip = (ast) => {
  if (ast instanceof Array) {
    return ast.map(strip);
  } else if (ast instanceof Object) {
    const stripped = {};
    for (const key of Object.keys(ast)) {
      if (!['end', 'loc', 'start', 'parent'].includes(key)) {
        stripped[key] = strip(ast[key]);
      }
    }
    return stripped;
  } else {
    return ast;
  }
};

/**
 * Convert a module to executable ecmascript function.
 * The conversion includes caching constant variables for reuse, and tree pruning.
 *
 * @param {string} script
 * @param {object} options
 * @param {string} options.path - The path to the script for producing relative paths.
 * @param {function(path:string} options.import - A method for resolving imports.
 */

export const toEcmascript = async (
  script,
  { path = '', topLevel = new Map() } = {}
) => {
  const parseOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: 'module',
    locations: true,
  };

  let ast = parse(script, parseOptions);

  const exportNames = [];

  const body = ast.body;
  const out = [];

  // Start by loading the controls
  const controls = (await read(`control/${path}`)) || {};

  const fromIdToSha = (id) => {
    const entry = topLevel.get(id);
    if (entry !== undefined) {
      return entry.sha;
    }
  };

  const declareVariable = async (
    declaration,
    declarator,
    { doExport = false } = {}
  ) => {
    if (
      declarator.init &&
      declarator.init.type === 'CallExpression' &&
      declarator.init.callee.type === 'Identifier' &&
      declarator.init.callee.name === 'control'
    ) {
      const [label, value] = declarator.init.arguments;
      let controlValue = controls[label.value];
      if (controlValue !== undefined) {
        // FIX: Let check these are valid.
        switch (typeof value.value) {
          case 'string':
            // FIX: Quotes
            value.raw = `'${controlValue}'`;
            value.value = String(controlValue);
            break;
          default:
            value.raw = `${controlValue}`;
            value.value = controlValue;
        }
      }
    }

    const id = declarator.id.name;
    const code = {
      type: 'VariableDeclaration',
      kind: declaration.kind,
      declarations: [strip(declarator)],
    };
    const dependencies = [];

    const Identifier = (node, state, c) => {
      dependencies.push(node.name);
    };

    recursive(declarator, undefined, { Identifier });

    const dependencyShas = dependencies.map(fromIdToSha);

    const definition = { code, dependencies, dependencyShas };
    const sha = hash(definition);

    let uncomputedInput = false;

    const generateSubprogram = () => {
      const body = [];
      const seen = new Set();
      const walk = (dependencies) => {
        for (const dependency of dependencies) {
          if (seen.has(dependency)) {
            continue;
          }
          seen.add(dependency);
          const entry = topLevel.get(dependency);
          if (entry === undefined) {
            continue;
          }
          if (!entry.isComputed) {
            uncomputedInput = true;
          }
          walk(entry.dependencies);
          body.push(entry.code);
        }
      };
      walk(dependencies);
      body.push(code);
      const program = { type: 'Program', body };
      return generate(program);
    };

    const program = generateSubprogram();

    const isAllInputComputed = !uncomputedInput;

    const entry = {
      code,
      definition,
      dependencies,
      program,
      sha,
      isAllInputComputed,
    };
    topLevel.set(id, entry);

    if (doExport) {
      exportNames.push(id);
    }

    if (declarator.init) {
      if (declarator.init.type === 'ArrowFunctionExpression') {
        // We can't cache functions.
        out.push(declaration);
        entry.isNotCacheable = true;
        return;
      } else if (declarator.init.type === 'Literal') {
        // Not much point in caching literals.
        out.push(declaration);
        entry.isNotCacheable = true;
        return;
      } else if (
        declarator.init.type === 'CallExpression' &&
        declarator.init.callee.type === 'Identifier' &&
        declarator.init.callee.name === 'control'
      ) {
        // We've already patched this.
        out.push(declaration);
        entry.isNotCacheable = true;
        return;
      }
    }

    out.push(
      parse(
        `emitSourceLocation({ line: ${declaration.loc.end.line}, column: ${declaration.loc.end.column} })`,
        parseOptions
      )
    );

    // Now that we have the sha, we can predict if it can be read from cache.
    const meta = await read(`meta/def/${path}/${id}`);
    if (meta && meta.sha === sha) {
      const readCode = strip(
        parse(`await loadGeometry('data/def/${path}/${id}')`, parseOptions)
      );
      const readExpression = readCode.body[0].expression;
      const init = readExpression;
      const cacheLoadCode = {
        ...declaration,
        declarations: [{ ...declarator, init }],
      };
      out.push(cacheLoadCode);
      const replayRecordedNotes = parse(
        `await replayRecordedNotes('data/note/${path}/${id}')`,
        parseOptions
      );
      out.push(replayRecordedNotes);
      entry.code = cacheLoadCode;
      entry.program = generate({
        type: 'Program',
        body: [cacheLoadCode, replayRecordedNotes],
      });
      entry.isComputed = true;
    } else {
      out.push(parse('beginRecordingNotes()', parseOptions));
      // FIX: Let's not hard-code card declarations.
      out.push(parse(`card\`${path}/${id}\`;`, parseOptions));
      out.push({ ...declaration, declarations: [declarator] });
      // Only cache Shapes.
      out.push(
        parse(
          `${id} instanceof Shape && await saveGeometry('data/def/${path}/${id}', ${id}) && await write('meta/def/${path}/${id}', { sha: '${sha}' });`,
          parseOptions
        )
      );
      out.push(
        parse(
          `await saveRecordedNotes('data/note/${path}/${id}')`,
          parseOptions
        )
      );
    }
    out.push(parse(`Object.freeze(${id});`, parseOptions));
  };

  for (let nth = 0; nth < body.length; nth++) {
    const entry = body[nth];
    if (entry.type === 'VariableDeclaration') {
      for (const declarator of entry.declarations) {
        await declareVariable(entry, declarator);
      }
    } else if (entry.type === 'ExportNamedDeclaration') {
      // Note the names and replace the export with the declaration.
      const declaration = entry.declaration;
      if (declaration.type === 'VariableDeclaration') {
        for (const declarator of declaration.declarations) {
          await declareVariable(entry.declaration, declarator, {
            doExport: true,
          });
        }
      }
    } else if (entry.type === 'ImportDeclaration') {
      const entry = body[nth];
      // Rewrite
      //   import { foo } from 'bar';
      //   import Foo from 'bar';
      // to
      //   const { foo } = importModule('bar');
      //   const Foo = importModule('bar');
      //
      // FIX: Handle other variations.
      const { specifiers, source } = entry;

      if (specifiers.length === 0) {
        out.push(parse(`await importModule('${source.value}');`, parseOptions));
      } else {
        for (const { imported, local, type } of specifiers) {
          switch (type) {
            case 'ImportDefaultSpecifier':
              out.push(
                parse(
                  `const ${local.name} = (await importModule('${source.value}')).default;`,
                  parseOptions
                )
              );
              break;
            case 'ImportSpecifier':
              if (local.name !== imported.name) {
                out.push(
                  parse(
                    `const { ${imported.name}: ${local.name} } = await importModule('${source.value}');`,
                    parseOptions
                  )
                );
              } else {
                out.push(
                  parse(
                    `const { ${imported.name} } = await importModule('${source.value}');`,
                    parseOptions
                  )
                );
              }
              break;
          }
        }
      }
    } else if (entry.type === 'ExpressionStatement') {
      out.push(
        parse(
          `emitSourceLocation({ line: ${entry.loc.end.line}, column: ${entry.loc.end.column} })`,
          parseOptions
        )
      );
      out.push(entry);
    } else {
      out.push(entry);
    }
  }

  // Return the exports as an object.
  out.push(parse(`return { ${exportNames.join(', ')} };`, parseOptions));

  const result =
    '\n' + generate(parse(out.map(generate).join('\n'), parseOptions));

  return result;
};
