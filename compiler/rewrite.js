import { builders, namedTypes, visit } from 'ast-types';
import { parse, print } from 'recast';
import { logInfo as baseLogInfo } from '@jsxcad/sys';

const {
  arrayExpression,
  callExpression,
  identifier,
  memberExpression,
  objectExpression,
  objectProperty,
  literal,
} = builders;

const {
  CallExpression,
  Identifier,
  Literal,
  MemberExpression,
  UnaryExpression,
} = namedTypes;

const logInfo = (text) => baseLogInfo('compiler/rewrite', text);

const rewriteOrient = (lastCall, { at, to, up }) => {
  // Ok, we should have extracted an x of Group(x).view(viewId).
  // The expression is organized like (a.b()).call(), which means that we're already at the final call.
  const lastCallee = lastCall.callee;
  const { property } = lastCallee;
  const orientation = [];
  if (at) {
    orientation.push(
      objectProperty(
        literal('at'),
        arrayExpression([literal(at[0]), literal(at[1]), literal(at[2])])
      )
    );
  }
  if (to) {
    orientation.push(
      objectProperty(
        literal('to'),
        arrayExpression([literal(to[0]), literal(to[1]), literal(to[2])])
      )
    );
  }
  if (up) {
    orientation.push(
      objectProperty(
        literal('up'),
        arrayExpression([literal(up[0]), literal(up[1]), literal(up[2])])
      )
    );
  }
  if (Identifier.check(property) && property.name === 'orient') {
    logInfo(`Rewriting orient`);
    // We need to rewrite the arguments of the orient call.
    // e.g. s.Box().orient(Old) -> s.Box().orient(New)
    lastCall.arguments = [objectExpression(orientation)];
    return lastCall;
  } else {
    logInfo(`Appending orient`);
    // We need to rewrite lastCall to be a chained method call
    // e.g. s.Box() -> s.Box().orient(New)
    const chained = memberExpression(
      lastCall,
      callExpression(identifier('orient'), [objectExpression(orientation)])
    );
    return chained;
  }
};

const extractViewMethodCall = (callExpression, allowedCalleeNames, viewId) => {
  const args = callExpression.get('arguments');
  const callee = callExpression.get('callee');
  const computed = callee.get('computed');
  const object = callee.get('object');
  const property = callee.get('property');
  if (computed.value) {
    // a[b]
    return {};
  }
  // a.b
  if (!Identifier.check(property.value)) {
    return {};
  }
  // a.b()
  if (property.get('name').value !== 'view') {
    return {};
  }
  logInfo('Found View call');
  // a.view()
  if (!CallExpression.check(object.value)) {
    return {};
  }
  let wasFound = false;
  for (const arg of args.value) {
    if (Literal.check(arg) && arg.value === viewId) {
      wasFound = true;
      break;
    }
  }
  if (!wasFound) {
    return {};
  }
  logInfo('Found ViewId');
  // a().view('id')
  if (!MemberExpression.check(callee.value)) {
    return {};
  }
  const calleeObject = callee.get('object');
  if (!CallExpression.check(calleeObject.value)) {
    return {};
  }
  const calleeObjectCallee = calleeObject.get('callee');
  if (!Identifier.check(calleeObjectCallee.value)) {
    return {};
  }
  const calleeName = calleeObjectCallee.get('name').value;
  if (!allowedCalleeNames.includes(calleeName)) {
    return {};
  }
  logInfo(`Found ObjectCallee ${calleeName}`);
  return { calleeObject, calleeObjectCallee };
};

export const extractViewGroupCode = (script, { viewId, nth }) => {
  const ast = parse(script);
  let code;
  visit(ast, {
    visitCallExpression(expression) {
      try {
        const { calleeObject } = extractViewMethodCall(
          expression,
          ['Group', 'Assembly'],
          viewId
        );
        if (!calleeObject) {
          return;
        }
        const args = calleeObject.get('arguments');
        const nthArg = args.value[nth];
        if (!nthArg) {
          return;
        }
        ({ code } = print(nthArg));
      } finally {
        this.traverse(expression);
      }
    },
  });
  return { code };
};

export const appendViewGroupCode = (
  script,
  { code, viewId, nth, at, to, up }
) => {
  const ast = parse(script);
  const astToAppend = rewriteOrient(parse(code).program.body[0].expression, {
    at,
    to,
    up,
  });
  console.log(
    `QQ/appendViewGroupCode/rewriteOrient: ${print(astToAppend).code}`
  );
  visit(ast, {
    visitCallExpression(expression) {
      try {
        const { calleeObject } = extractViewMethodCall(
          expression,
          ['Group', 'Assembly'],
          viewId
        );
        if (!calleeObject) {
          return;
        }
        const args = calleeObject.get('arguments');
        args.value.push(astToAppend);
      } finally {
        this.traverse(expression);
      }
    },
  });
  return print(ast).code;
};

export const deleteViewGroupCode = (script, { viewId, nth }) => {
  const ast = parse(script);
  visit(ast, {
    visitCallExpression(expression) {
      try {
        const { calleeObject } = extractViewMethodCall(
          expression,
          ['Group', 'Assembly'],
          viewId
        );
        if (!calleeObject) {
          return;
        }
        const args = calleeObject.get('arguments');
        args.value.splice(nth, 1);
      } finally {
        this.traverse(expression);
      }
    },
  });
  return print(ast).code;
};

export const rewriteViewGroupOrient = (script, { viewId, nth, at, to, up }) => {
  const ast = parse(script);
  visit(ast, {
    visitCallExpression(expression) {
      try {
        const { calleeObject } = extractViewMethodCall(
          expression,
          ['Group', 'Assembly'],
          viewId
        );
        if (!calleeObject) {
          return;
        }
        const args = calleeObject.get('arguments');
        const nthArg = args.value[nth];
        if (!nthArg) {
          return;
        }
        logInfo(`Found nthArg ${nthArg}`);
        // Ok, we should have extracted an x of Group(x).view(viewId).
        // The expression is organized like (a.b()).call(), which means that we're already at the final call.
        args.value[nth] = rewriteOrient(nthArg, { at, to, up });
        /*
        const lastCall = nthArg;
        const lastCallee = lastCall.callee;
        const { property } = lastCallee;
        const orientation = [];
        if (at) {
          orientation.push(
            objectProperty(
              literal('at'),
              arrayExpression([literal(at[0]), literal(at[1]), literal(at[2])])
            )
          );
        }
        if (to) {
          orientation.push(
            objectProperty(
              literal('to'),
              arrayExpression([literal(to[0]), literal(to[1]), literal(to[2])])
            )
          );
        }
        if (up) {
          orientation.push(
            objectProperty(
              literal('up'),
              arrayExpression([literal(up[0]), literal(up[1]), literal(up[2])])
            )
          );
        }
        if (Identifier.check(property) && property.name === 'orient') {
          logInfo(`Rewriting orient`);
          // We need to rewrite the arguments of the orient call.
          // e.g. s.Box().orient(Old) -> s.Box().orient(New)
          lastCall.arguments = [objectExpression(orientation)];
        } else {
          logInfo(`Appending orient`);
          // We need to rewrite lastCall to be a chained method call
          // e.g. s.Box() -> s.Box().orient(New)
          const chained = memberExpression(
            lastCall,
            callExpression(identifier('orient'), [
              objectExpression(orientation),
            ])
          );
          args.value[nth] = chained;
        }
*/
      } finally {
        this.traverse(expression);
      }
    },
  });
  return print(ast).code;
};

export const rewriteVoxels = (
  script,
  { editId, pointToAppend, pointToRemove }
) => {
  const ast = parse(script);
  // As we generate the ast locally it's safe for us to destructively modify it.

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
        if (property.get('name').value !== 'edit') {
          return;
        }
        // a.edit()
        if (!CallExpression.check(object.value)) {
          return;
        }
        let wasFound = false;
        for (const arg of args.value) {
          if (Literal.check(arg) && arg.value === editId) {
            wasFound = true;
            break;
          }
        }
        if (!wasFound) {
          return;
        }
        // a().edit('id')
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
        // Voxels().edit('id')
        if (pointToAppend) {
          calleeObject
            .get('arguments')
            .push(
              arrayExpression(pointToAppend.map((value) => literal(value)))
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
