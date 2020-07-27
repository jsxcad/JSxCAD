const { Type } = require('@jsxcad/typecheck');
const {
  getArgumentsForCalledFunction,
  getArgumentsForFunctionCall,
  getContainingFunctionDeclaration,
  getNameOfCalledFunction,
  setCaches,
  resolveType,
  storeProgram,
} = require('./utils.js');

module.exports = {
  create: function (context) {
    for (const option of context.options) {
      if (option.cache) {
        setCaches(option.cache);
      }
    }
    const { ignoreTrailingUndefineds = false } = context.options[0] || {};

    return {
      AssignmentExpression(node) {
        const identifierType = resolveType(node.left, context);
        const assignmentType = resolveType(node.right, context);
        if (!assignmentType.isOfType(identifierType)) {
          context.report({
            message: `can't assign type ${assignmentType} to variable of type ${identifierType}`,
            node,
          });
        }
      },

      CallExpression(node) {
        const functionName = getNameOfCalledFunction(node, context);
        const functionType = resolveType(node.callee, context);
        const argumentCount = functionType.getArgumentCount();
        const callTypes = getArgumentsForFunctionCall(node, context);

        for (let index = 0; index < argumentCount; index++) {
          const argumentType = functionType.getArgument(index);
          const callType = callTypes[index];
          if (callType !== undefined && !callType.isOfType(argumentType)) {
            context.report({
              message: `type ${argumentType} expected for argument ${index} in call to ${functionName} but ${callType} provided`,
              node,
            });
          } else if (
            callType === undefined &&
            !Type.undefined.isOfType(argumentType)
          ) {
            if (!ignoreTrailingUndefineds) {
              context.report({
                message: `type ${argumentType} expected for argument ${index} in call to ${functionName} but undefined implicitly provided`,
                node,
              });
            }
          }
        }
      },

      Program(node) {
        storeProgram(node, context);
      },

      ReturnStatement(node) {
        const containingFunction = getContainingFunctionDeclaration(
          node,
          context
        );
        if (!containingFunction) throw Error('die');
        const functionType = resolveType(containingFunction, context);
        const expectedReturnType = functionType.getReturn();

        if (!node.argument && expectedReturnType) {
          /* bare `return;` statement */

          if (
            !Type.undefined.isOfType(expectedReturnType) &&
            !allowImplicitUndefineds
          ) {
            context.report({
              message: `returning an implicit undefined from a function declared to return ${expectedReturnType}`,
              node,
            });
          }

          return;
        }

        const actualReturnType = resolveType(node.argument, context);

        if (!actualReturnType.isOfType(expectedReturnType)) {
          context.report({
            message: `returning ${actualReturnType} from a function declared to return ${expectedReturnType}`,
            node,
          });
        }
      },

      VariableDeclarator(node) {
        const identifierType = resolveType(node, context);

        const initType = node.init
          ? resolveType(node.init, context)
          : Type.undefined;

        if (!initType.isOfType(identifierType)) {
          context.report({
            message: `can't initialize variable of type ${identifierType} with value of type ${initType}`,
            node,
          });
        }
      },
    };
  },
};
