module.exports = {
  extends: ['standard', 'plugin:react/recommended'],
  parser: '@babel/eslint-parser',
  rules: {
    'max-len': [1, 120, 2],
    semi: [2, 'always'],
    'no-new-func': 0,
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^',
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    indent: [
      0,
      2,
      {
        ArrayExpression: 'first',
        CallExpression: { arguments: 'first' },
        FunctionDeclaration: { body: 1, parameters: 'first' },
        FunctionExpression: { parameters: 'first' },
        ImportDeclaration: 'first',
        MemberExpression: 2,
        ObjectExpression: 'first',
        SwitchCase: 1,
        VariableDeclarator: 'first',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'space-before-function-paren': [0, 'ignore'],
    'comma-dangle': [0, 'ignore'],
    'space-in-parens': [0, 'ignore'],
  },
};
