const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/algorithm-bsp', require },
            'build',
            'clipPolygons',
            'clipTo',
            'create',
            'fromPolygons',
            'invert',
            'splitPolygon',
            'toPolygons');
