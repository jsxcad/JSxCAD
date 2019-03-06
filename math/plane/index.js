const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/math-plane', require },
            'create',
            'equals',
            'flip',
            'fromNormalAndPoint',
            'fromPoints',
            'fromPointsRandom',
            'signedDistanceToPoint',
            'splitLineSegmentByPlane',
            'toXYPlaneTransforms',
            'transform');
