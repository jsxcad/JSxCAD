import recast from 'recast';
import types from 'ast-types';

export const toEcmascript = (options, script) => {
  let ast = recast.parse(script);

  const exportNames = [];
  const expressions = [];

  const body = ast.program.body;
  const out = [];

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
    } else {
      expressions.push(entry);
    }
  }

  // Set up a main.
  if (exportNames.includes('main')) {
    // They export a main function, so assume they know what they're doing.
    out.push(...expressions);
  } else {
    // They don't export a main function, so build one for them.
    if (expressions.length >= 1) {
      // Turn any final expression into a return statement.
      const last = expressions.length - 1;
      const tail = expressions[last];
      if (tail.type === 'ExpressionStatement') {
        expressions[last] = {
          type: 'ReturnStatement',
          argument: expressions[last]
        };
      }
    }
    const main = {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'main'
        },
        init: {
          type: 'ArrowFunctionExpression',
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            body: expressions
          },
          generator: false,
          expression: true
        }
      }],
      kind: 'const'
    };
    out.push(main);
    exportNames.push('main');
  }

  // Return the exports as an object.
  out.push({
    type: 'ReturnStatement',
    argument: {
      type: 'ObjectExpression',
      properties:
            exportNames.map(name => ({
              type: 'Property',
              key: { type: 'Identifier', name },
              value: { type: 'Identifier', name }
            }))
    }
  });

  ast = {
    type: 'Program',
    body: out
  };

  // Make arrow functions async.
  // Await on calls.
  // FIX: assemble(...x.map(f => f + 1)) breaks because it doesn't realize that
  // it's getting promises.
  // Either await all arguments, or find a different approach.
  types.visit(ast, {
    visitArrowFunctionExpression: function (path) {
      this.traverse(path);
      path.node.async = true;
    },
    visitCallExpression: function (path) {
      this.traverse(path);
      path.replace({
        type: 'ParenthesizedExpression',
        expression: {
          type: 'AwaitExpression',
          argument: path.node
        }
      });
    }
  });
  return recast.print(ast).code;
};
