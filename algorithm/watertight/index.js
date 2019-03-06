const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/algorithm-watertight', require },
            'isWatertightPolygons',
            'makeWatertight');
