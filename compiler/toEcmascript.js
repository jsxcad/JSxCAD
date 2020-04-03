// FIX: Is this specific to the v1 api? If so, move it there.

import { generate } from 'astring';
import { parse } from 'acorn';
import { recursive } from 'acorn-walk';
import hash from 'object-hash';

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

const fromObjectExpression = ({ properties }) => {
  const object = {};
  for (const { key, value } of properties) {
    if (value.type === 'StringLiteral') {
      object[key.value] = value.value;
    } else if (value.type === 'ArrayExpression') {
      object[key.value] = value.elements.map(element => element.value);
    } else if (value.type === 'ObjectExpression') {
      object[key.value] = fromObjectExpression(value);
    } else {
      throw Error('die');
    }
  }
  return object;
};

const nullImport = () => 'return {};';

export const toEcmascript = (script, options = {}) => {
  const { importer = nullImport } = options;
  const parseOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: 'module'
  };
  let ast = parse(script, parseOptions);

  const exportNames = [];
  const body = ast.body;
  const out = [];

  console.log(`QQ/ast: ${JSON.stringify(strip(ast), null, 2)}`);

  const topLevel = new Map();

  const fromIdToSha = (id) => {
    const entry = topLevel.get(id);
    if (entry === null) {
    }
  }

  const declareVariable = (declarator, { doExport = false } = {}) => {
    const id = declarator.id.name;
    const code = strip(declarator);
    const dependencies = [];

    const CallExpression = (node, state, c) => {
      if (node.callee.name) {
        dependencies.push(node.callee.name);
      }
    }

    recursive(declarator, undefined, { CallExpression });

    const dependencyShas = dependencies.map(dependency => topLevel.get(id) || 

    const definition = { code, dependencies, dependencyShas };
    const sha = hash(definition);
    const entry = { sha, definition };
    console.log(`QQ/entry: ${JSON.stringify({ id, entry })}`);
    topLevel.set(id, entry);
    if (doExport) {
      exportNames.push(id);
    }
  }

  for (let nth = 0; nth < body.length; nth++) {
    const entry = body[nth];
    if (entry.type === 'VariableDeclaration') {
      for (const declarator of entry.declarations) {
        declareVariable(declarator);
      }
      out.push(entry);
    } else if (entry.type === 'ExportNamedDeclaration') {
      // Note the names and replace the export with the declaration.
      const declaration = entry.declaration;
      if (declaration.type === 'VariableDeclaration') {
        for (const declarator of declaration.declarations) {
          declareVariable(declarator, { doExport: true });
        }
      }
      out.push(entry);
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
      const module = importer(source.value, options);

      out.push(parse(`const $module = (() => { ${module} })();`, parseOptions));

      if (specifiers.length > 0) {
        for (const { imported, local, type } of specifiers) {
          switch (type) {
            case 'ImportDefaultSpecifier': {
              out.push(parse(`const ${local.name} = $module.default;`, parseOptions));
              break;
            }
            case 'ImportSpecifier': {
              out.push(parse(`const { ${imported.name} } = $module;`, parseOptions));
              break;
            }
          }
        }
      }
    } else {
      out.push(entry);
    }
  }

  out.push(parse(`return { ${exportNames.join(', ')} };`, parseOptions));

  const result = '\n' + generate(parse(out.map(generate).join('\n'), parseOptions));
  return result;
};
