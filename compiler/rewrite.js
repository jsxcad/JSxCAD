import { builders, namedTypes, visit } from 'ast-types';
import { parse, print } from 'recast';

export const rewrite = (script, { viewId, pointToAppend, pointToRemove }) => {
  const ast = parse(script);
  // As we generate the ast locally it's safe for us to destructively modify it.

  const {
    CallExpression,
    Identifier,
    Literal,
    MemberExpression,
    UnaryExpression,
  } = namedTypes;

  const toValue = (expression) => {
    // const [x, y, z] = value.elements.map(element => element.value);
    if (UnaryExpression.check(expression) && expression.operator === '-') {
      return -expression.argument.value;
    } else if (Literal.assert(expression)) {
      return expression.value;
    }
  };

  visit(ast, {
    visitCallExpression(callExpression) {
      const op = () => {
        const args = callExpression.get('arguments');
        const callee = callExpression.get('callee');
        const computed = callee.get('computed');
        const object = callee.get('object');
        const property = callee.get('property');
        if (computed.value) {
          // a[b]
          return;
        }
        // a.b
        if (!Identifier.check(property.value)) {
          return;
        }
        // a.b()
        if (property.get('name').value !== 'view') {
          return;
        }
        // a.view()
        if (!CallExpression.check(object.value)) {
          return;
        }
        let wasFound = false;
        for (const arg of args.value) {
          if (Literal.check(arg) && arg.value === viewId) {
            wasFound = true;
            break;
          }
        }
        if (!wasFound) {
          return;
        }
        // a().view('id')
        if (!MemberExpression.check(callee.value)) {
          return;
        }
        const calleeObject = callee.get('object');
        if (!CallExpression.check(calleeObject.value)) {
          return;
        }
        const calleeObjectCallee = calleeObject.get('callee');
        if (!Identifier.check(calleeObjectCallee.value)) {
          return;
        }
        if (calleeObjectCallee.get('name').value !== 'Voxels') {
          return;
        }
        if (pointToAppend) {
          calleeObject
            .get('arguments')
            .push(
              builders.arrayExpression(
                pointToAppend.map((value) => builders.literal(value))
              )
            );
        }
        if (pointToRemove) {
          const stack = [];
          const args = calleeObject.get('arguments').value;
          while (args.length > 0) {
            const value = args.pop();
            const [x, y, z] = value.elements.map(toValue);
            // const [x, y, z] = value.elements.map(element => element.value);
            if (
              x !== pointToRemove[0] ||
              y !== pointToRemove[1] ||
              z !== pointToRemove[2]
            ) {
              stack.push(value);
            }
          }
          while (stack.length > 0) {
            args.push(stack.pop());
          }
        }
      };
      op();
      this.traverse(callExpression);
    },
  });

  return print(ast).code;
};
