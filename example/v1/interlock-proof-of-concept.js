import '@jsxcad/api-v1-stl';

Cube.fromCorners([0, 0, 0], [40, 4, 1])
  .with(
    Cube.fromCorners([0, 1, 1], [40, 3, 2.5]),
    Cube.fromCorners([0, 10, 0], [40, 14, 1]),
    Cube.fromCorners([0, 10, 1], [40, 11, 2.5]),
    Cube.fromCorners([0, 13, 1], [40, 14, 2.5])
  )
  .Item()
  .Page()
  .writeStl('interlock-proof-of-concept');
