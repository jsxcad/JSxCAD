import Point from './Point.js';
import Shape from './Shape.js';
import extrudeAlong from './extrudeAlong.js';

export const extrudeX = Shape.registerMethod2(
  ['extrudeX', 'ex'],
  ['input', 'intervals', 'modes'],
  (input, extents, modes) =>
    extrudeAlong(Point(1, 0, 0), ...extents, ...modes)(input)
);

export const ex = extrudeX;

export const extrudeY = Shape.registerMethod2(
  ['extrudeY', 'ey'],
  ['input', 'intervals', 'modes'],
  (input, extents, modes) =>
    extrudeAlong(Point(0, 1, 0), ...extents, ...modes)(input)
);

export const ey = extrudeY;

export const extrudeZ = Shape.registerMethod2(
  ['extrudeZ', 'ez'],
  ['input', 'intervals', 'modes'],
  (input, extents, modes) =>
    extrudeAlong(Point(0, 0, 1), ...extents, ...modes)(input)
);

export const ez = extrudeZ;
