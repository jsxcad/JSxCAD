const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/algorithm-paths', require },
            'canonicalize',
            'eachPoint',
            'flip',
            'measureBoundingBox',
            'transform');
