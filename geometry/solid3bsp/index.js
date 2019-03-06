const { publish } = require('@jsxcad/provide');

module.exports = publish({ base: '@jsxcad/geometry-solid3bsp', require },
                         'difference',
                         'fromPolygons',
                         'intersection',
                         'flip',
                         'toPaths',
                         'toPoints',
                         'toPolygons',
                         'transform',
                         'union');
