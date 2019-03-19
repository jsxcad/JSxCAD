module.exports = {
    "extends": "standard",
    "parser": "babel-eslint",
    "rules": {
        "max-len": [1, 120, 2],
        "semi": [2, "always"],
        "indent": ["error",
                   2,
                   {
                     "ArrayExpression": "first",
                     "CallExpression": { "arguments": "first" },
                     "FunctionDeclaration": { "body": 1, "parameters": "first" },
                     "FunctionExpression": { "parameters": "first" },
                     "ImportDeclaration": "first",
                     "MemberExpression": 2,
                     "ObjectExpression": "first",
                     "SwitchCase": 1, 
                     "VariableDeclarator": "first"
                   }]
    }
};
