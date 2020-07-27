const { resolveType, storeProgram } = require('./utils.js');
const { Type } = require('@jsxcad/typecheck');

module.exports = {
    create: function(context) {
        return {
            AssignmentExpression(node) {
                const identifierType = resolveType(node.left, context);
                const assignmentType = resolveType(node.right, context);
                if (!assignmentType.isOfType(identifierType)) {
                    context.report({
                        message: `can't assign type ${assignmentType} to variable of type ${identifierType}`,
                        node
                    });
                }
            },

            Program(node) {
                storeProgram(node, context);
            },

            VariableDeclarator(node) {
                const identifierType = resolveType(node, context);

                const initType = node.init ? resolveType(node.init, context) : Type.undefined;

                if (!initType.isOfType(identifierType)) {
                    context.report({
                        message: `can't initialize variable of type ${identifierType} with value of type ${initType}`,
                        node
                    });
                }
            }
        };
    }
};
