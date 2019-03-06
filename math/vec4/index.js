const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/math-vec4', require },
            'dot',
            'equals',
            'fromScalar',
            'fromValues',
            'toString',
            'transform');
