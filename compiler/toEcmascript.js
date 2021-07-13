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
  { path = '', topLevel = new Map(), updates = [] } = {}
) => {
  const parseOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: 'module',
    locations: true,
  };

  let ast = parse(script, parseOptions);

  let toplevelExpressionCount = 0;

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

    const generateCacheLoadCode = ({ isNotCacheable, code, path, id }) => {
      if (isNotCacheable) {
        return [code];
      }
      return [
        parse(
          `const ${id} = await loadGeometry('data/def/${path}/${id}')`,
          parseOptions
        ),
        parse(`Object.freeze(${id});`, parseOptions),
      ];
    };

    const generateReplayCode = ({ isNotCacheable, code, path, id }) => {
      if (isNotCacheable) {
        return [code];
      }
      const cacheLoadCode = generateCacheLoadCode(entry);
      const replayRecordedNotes = parse(
        `await replayRecordedNotes('${path}', '${id}')`,
        parseOptions
      );
      return [...cacheLoadCode, replayRecordedNotes];
    };

    const generateUpdateCode = ({
      isNotCacheable,
      code,
      dependencies,
      path,
      id,
    }) => {
      if (isNotCacheable) {
        return [code];
      }

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
          body.push(...generateCacheLoadCode(entry));
        }
      };
      walk(dependencies);
      body.push(parse(`info('define ${id}');`, parseOptions));
      body.push(
        parse(
          `beginRecordingNotes('${path}', '${id}', { line: ${declaration.loc.start.line}, column: ${declaration.loc.start.column} })`,
          parseOptions
        )
      );
      body.push(code);
      // Only cache Shapes.
      body.push(
        parse(
          `${id} instanceof Shape && await saveGeometry('data/def/${path}/${id}', ${id}) && await write('meta/def/${path}/${id}', { sha: '${sha}' });`,
          parseOptions
        )
      );
      body.push(
        parse(`await saveRecordedNotes('${path}', '${id}')`, parseOptions)
      );
      const program = { type: 'Program', body };
      return generate(program);
    };

    const isAllInputComputed = !uncomputedInput;

    const entry = {
      path,
      id,
      code,
      definition,
      dependencies,
      sha,
      isAllInputComputed,
      sourceLocation: declaration.loc,
    };

    topLevel.set(id, entry);

    if (doExport) {
      exportNames.push(id);
    }

    if (declarator.init) {
      if (declarator.init.loc) {
        entry.initSourceLocation = declarator.init.loc;
      }
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

    out.push(...generateReplayCode(entry));

    const meta = await read(`meta/def/${path}/${id}`);
    if (!meta || meta.sha !== sha) {
      updates[`${path}/${id}`] = {
        dependencies,
        program: generateUpdateCode(entry),
      };
    }
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
      // This is an ugly way of turning top level expressions into declarations.
      const declaration = parse(
        `const $${++toplevelExpressionCount} = ${generate(entry)}`,
        parseOptions
      ).body[0];
      const declarator = declaration.declarations[0];
      await declareVariable(declaration, declarator);
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
