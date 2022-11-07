import Point from './Point.js';
import Shape from './Shape.js';
import extrudeAlong from './extrudeAlong.js';

export const extrudeX = Shape.registerMethod(['extrudeX', 'ex'], (...extents) =>
  extrudeAlong(Point(1, 0, 0), ...extents));

export const ex = extrudeX;

export const extrudeY = Shape.registerMethod(['extrudeY', 'ey'], (...extents) =>
  extrudeAlong(Point(0, 1, 0), ...extents));

export const ey = extrudeY;

export const extrudeZ = Shape.registerMethod(['extrudeZ', 'ez'], (...extents) =>
  extrudeAlong(Point(0, 0, 1), ...extents));

export const ez = extrudeZ;
