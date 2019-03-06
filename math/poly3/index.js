const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/math-poly3', require },
            'canonicalize',
            'eachEdge',
            'flip',
            'fromPoints',
            'isConvex',
            'map',
            'measureArea',
            'measureSignedVolume',
            'measureBoundingBox',
            'measureBoundingSphere',
            'toEdges',
            'toPlane',
            'toPoints',
            'transform',
            'translate');
