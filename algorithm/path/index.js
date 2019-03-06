const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/algorithm-path', require },
            'canonicalize',
            'flip',
            'measureArea',
            'transform');
