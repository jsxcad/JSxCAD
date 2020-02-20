// FIX: Is this specific to the v1 api? If so, move it there.

import { generate } from 'astring';
import { parse } from 'acorn';
import { recursive } from 'acorn-walk';

export const toEcmascript = (script) => {
  const parseOptions = { sourceType: 'module' };
  const ast = parse(script, parseOptions);
  const definitions = [];

  // TODO: Handle imports in the notebook.

  const CallExpression = (node, state, c) => {
    try {
      if (node.callee.object.callee.object.name === 'main' && node.callee.object.callee.property.name === 'variable' && node.callee.property.name === 'define') {
        const name = node.callee.object.arguments[0].arguments[0].value;
        const op = node.arguments[node.arguments.length - 1].body;
        const fun = op.body[0].argument;
        if (!name.startsWith('viewof ')) {
          definitions.push(`export var ${name} = ${generate(fun)};`);
        }
        return;
      }
    } catch (e) {
      // console.log('' + e);
    }
    c(node.callee, state);
    node.arguments.forEach(argument => c(argument, state));
  };

  recursive(ast, undefined, { CallExpression });

  return generate(parse(definitions.join('\n'), parseOptions));
};
