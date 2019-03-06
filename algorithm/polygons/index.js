const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/algorithm-polygons', require },
            'canonicalize',
            'eachPoint',
            'fromPointsAndPaths',
            'makeConvex',
            'measureBoundingBox',
            'scale',
            'subtract',
            'toPoints',
            'transform',
            'translate');
