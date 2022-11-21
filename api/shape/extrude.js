import Point from './Point.js';
import Shape from './Shape.js';
import extrudeAlong from './extrudeAlong.js';

export const extrudeX = Shape.registerMethod(
  ['extrudeX', 'ex'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(1, 0, 0), ...extents)(shape)
);

export const ex = extrudeX;

export const extrudeY = Shape.registerMethod(
  ['extrudeY', 'ey'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(0, 1, 0), ...extents)(shape)
);

export const ey = extrudeY;

export const extrudeZ = Shape.registerMethod(
  ['extrudeZ', 'ez'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(0, 0, 1), ...extents)(shape)
);

export const ez = extrudeZ;
