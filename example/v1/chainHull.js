import '@jsxcad/api-v1-stl';

await Circle(10).moveZ(-10)
        .chainHull(
            Square(5),
            Circle(10).moveZ(10))
        .writeStl('stl/chainHull.stl');
