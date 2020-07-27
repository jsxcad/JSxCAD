const {
    getContainingFunctionDeclaration,
    resolveType,
    storeProgram
} = require('./utils.js');

const { Type } = require('@jsxcad/typecheck');

module.exports = {
    create: function(context) {
        const {
            allowImplicitUndefineds = false
        } = context.options[0] || {};

        return {
            Program(node) {
                storeProgram(node, context);
            },
            ReturnStatement(node) {
                const containingFunction = getContainingFunctionDeclaration(node, context);
                if (!containingFunction) throw Error('die');
                const functionType = resolveType(containingFunction, context);
                const expectedReturnType = functionType.getReturn();

                if (!node.argument && expectedReturnType) {
                    /* bare `return;` statement */

                    if (!Type.undefined.isOfType(expectedReturnType)
                        && !allowImplicitUndefineds) {
                        context.report({
                            message: `returning an implicit undefined from a function declared to return ${expectedReturnType}`,
                            node
                        });
                    }

                    return;
                }

                const actualReturnType = resolveType(node.argument, context);

                if (!actualReturnType.isOfType(expectedReturnType)) {
                    context.report({
                        message: `returning ${actualReturnType} from a function declared to return ${expectedReturnType}`,
                        node
                    });
                }
            }
        };
    }
};
