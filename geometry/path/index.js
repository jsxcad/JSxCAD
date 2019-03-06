const { publish } = require('@jsxcad/provide');

// TODO: Turn this back into a class so that we can use normal dispatch.

module.exports = publish({ base: '@jsxcad/geometry-path', require },
                         'appendPoint',
                         'concat',
                         'close',
                         'create',
                         'eachPoint',
                         'equals',
                         'fromPoints',
                         'reverse',
                         'toPaths',
                         'toPoints',
                         'transform');
