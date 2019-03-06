const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/math-line2', require },
            'canonicalize',
            'clone',
            'closestPoint',
            'create',
            'direction',
            'distanceToPoint',
            'equals',
            'fromPoints',
            'fromValues',
            'intersectPointOfLines',
            'origin',
            'reverse',
            'toString',
            'transform',
            'xAtY');
