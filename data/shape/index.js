const { publish } = require('@jsxcad/provide');

module.exports =
    publish({ base: '@jsxcad/data-shape', require },
            'unitCube',
            'unitGeodesicSphere',
            'unitRegularIcosahedron',
            'unitRegularTriangularPrism',
            'unitSquare',
            'unitRegularTriangle');
