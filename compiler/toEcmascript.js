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
      if (['end', 'loc', 'start'].includes(key)) {
        continue;
      }
      stripped[key] = strip(ast[key]);
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

export const toEcmascript = async (script, { path } = {}) => {
  const parseOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: 'module',
  };
  let ast = parse(script, parseOptions);

  const exportNames = [];

  const body = ast.body;
  const out = [];

  const topLevel = new Map();

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
    const id = declarator.id.name;
    const code = strip(declarator);
    const dependencies = [];

    const Identifier = (node, state, c) => {
      dependencies.push(node.name);
    };

    // walk(declarator, undefined, { CallExpression, Identifier });
    recursive(declarator, undefined, { Identifier });

    const dependencyShas = dependencies.map(fromIdToSha);

    const definition = { code, dependencies, dependencyShas };
    const sha = hash(definition);
    const entry = { sha, definition };
    topLevel.set(id, entry);
    if (doExport) {
      exportNames.push(id);
    }

    if (declarator.init) {
      if (declarator.init.type === 'ArrowFunctionExpression') {
        // We can't cache functions.
        out.push(declaration);
        return;
      } else if (declarator.init.type === 'Literal') {
        // Not much point in caching literals.
        out.push(declaration);
        return;
      }
    }
    // Now that we have the sha, we can predict if it can be read from cache.
    const meta = await read(`meta/def/${id}`);
    if (meta && meta.sha === sha) {
      const readCode = strip(
        parse(`await read('data/def/${id}')`, parseOptions)
      );
      const readExpression = readCode.body[0].expression;
      const init = readExpression;
      out.push({ ...declaration, declarations: [{ ...declarator, init }] });
    } else {
      out.push({ ...declaration, declarations: [declarator] });
      out.push(
        parse(
          `await write('data/def/${id}', ${id}) && await write('meta/def/${id}', { sha: '${sha}' });`,
          parseOptions
        )
      );
    }
  };

  for (let nth = 0; nth < body.length; nth++) {
    const entry = body[nth];
    if (entry.type === 'VariableDeclaration') {
      for (const declarator of entry.declarations) {
        await declareVariable(entry, declarator);
      }
      // out.push(entry);
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
      // out.push(entry.declaration);
    } else if (entry.type === 'ImportDeclaration') {
      // FIX: This works for non-redefinable modules, but not redefinable modules.
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
              out.push(
                parse(
                  `const { ${imported.name} } = await importModule('${source.value}');`,
                  parseOptions
                )
              );
              break;
          }
        }
      }
    } else if (
      entry.type === 'ExpressionStatement' &&
      entry.expression.type === 'ObjectExpression'
    ) {
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
