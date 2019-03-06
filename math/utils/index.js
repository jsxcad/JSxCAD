const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/math-utils', require },
            'clamp',
            'degToRad',
            'quantizeForSpace',
            'radToDeg',
            'reallyQuantizeForSpace',
            'solve2Linear');
