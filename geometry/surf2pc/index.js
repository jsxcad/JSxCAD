const { publish } = require('@jsxcad/provide');

module.exports = publish({ base: '@jsxcad/geometry-surf2pc', require },
                         'difference',
                         'eachPoint',
                         'equals',
                         'flip',
                         'fromPolygons',
                         'intersection',
                         'toPaths',
                         'toPolygons',
                         'transform',
                         'union');
