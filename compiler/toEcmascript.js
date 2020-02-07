// FIX: Is this specific to the v1 api? If so, move it there.

import { generate } from 'astring';
import { parse } from 'acorn';

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

export const toEcmascript = (options, script) => {
  const parseOptions = {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: 'module'
  };
  let ast = parse(script, parseOptions);

  const exportNames = [];
  const expressions = [];

  const body = ast.body;
  const out = [];
  const annotations = { imports: {} };

  // Separate top level exports and expressions.
  // FIX: This will reorder things unnecessarily when export main is present.
  for (let nth = 0; nth < body.length; nth++) {
    const entry = body[nth];
    if (entry.type === 'ExportNamedDeclaration') {
      // Note the names and replace the export with the declaration.
      const declaration = entry.declaration;
      if (declaration.type === 'VariableDeclaration') {
        for (const declarator of declaration.declarations) {
          if (declarator.type === 'VariableDeclarator') {
            const name = declarator.id.name;
            exportNames.push(name);
          }
        }
        out.push(declaration);
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
              out.push(parse(`const ${local.name} = (await importModule('${source.value}')).default;`, parseOptions));
              break;
            case 'ImportSpecifier':
              out.push(parse(`const { ${imported.name} } = await importModule('${source.value}');`, parseOptions));
              break;
          }
        }
      }
    } else if (entry.type === 'ExpressionStatement' && entry.expression.type === 'ObjectExpression') {
      Object.assign(annotations, fromObjectExpression(entry.expression));
    } else if (entry.type === 'ExpressionStatement' && entry.expression.type === 'CallExpression' && entry.expression.callee.name === 'source') {
      // source('a', 'b') needs to be kept at the top level to support imports and avoid repetition.
      out.push(entry);
    } else {
      expressions.push(entry);
    }
  }

  // Set up a main.
  if (exportNames.length > 0) {
    // They export something, so assume they know what they're doing.
    out.push(...expressions);
  } else {
    // They don't export a main function, so build one for them.
    if (expressions.length >= 1) {
      // Turn any final expression into a return statement.
      const last = expressions.length - 1;
      const tail = expressions[last];
      if (tail.type === 'ExpressionStatement') {
        expressions[last] = parse(`return ${generate(expressions[last])}`, parseOptions);
      }
    }
    const main = parse(`const main = async () => { ${expressions.map(expression => generate(expression)).join('\n')} };`, parseOptions);
    out.push(main);
    exportNames.push('main');
  }

  // Return the exports as an object.
  out.push(parse(`return { ${exportNames.join(', ')} };`, parseOptions));

  const result = generate(parse(`return async () => { ${out.map(generate).join('\n')} };`, parseOptions));
  return result;
};
