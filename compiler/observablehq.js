// FIX: Is this specific to the v1 api? If so, move it there.

import AString from 'astring';
import Acorn from 'acorn';
import AcornWalk from 'acorn-walk';

export const toEcmascript = (script) => {
  const parseOptions = { sourceType: 'module' };
  const ast = Acorn.parse(script, parseOptions);
  const definitions = [];

  // TODO: Handle imports in the notebook.

  const CallExpression = (node, state, c) => {
    try {
      if (
        node.callee.object.callee.object.name === 'main' &&
        node.callee.object.callee.property.name === 'variable' &&
        node.callee.property.name === 'define'
      ) {
        const name = node.callee.object.arguments[0].arguments[0].value;
        const op = node.arguments[node.arguments.length - 1].body;
        const fun = op.body[0].argument;
        if (!name.startsWith('viewof ')) {
          definitions.push(`export var ${name} = ${AString.generate(fun)};`);
        }
        return;
      }
    } catch (e) {
      // console.log('' + e);
    }
    c(node.callee, state);
    node.arguments.forEach((argument) => c(argument, state));
  };

  AcornWalk.recursive(ast, undefined, { CallExpression });

  return AString.generate(Acorn.parse(definitions.join('\n'), parseOptions));
};
