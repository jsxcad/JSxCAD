const { publish } = require('@jsxcad/provide');

module.exports = publish({ base: '@jsxcad/geometry-solid3jscad', require },
                         'difference',
                         'fromPolygon',
                         'intersection',
                         'invert',
                         'toPolygons',
                         'transform',
                         'union');
