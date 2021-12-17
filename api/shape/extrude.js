import Point from './Point.js';
import Shape from './Shape.js';
import extrudeAlong from './extrudeAlong.js';

export const extrudeX = (...extents) => extrudeAlong(Point(1, 0, 0), ...extents);
export const extrudeY = (...extents) => extrudeAlong(Point(0, 1, 0), ...extents);
export const extrudeZ = (...extents) => extrudeAlong(Point(0, 0, 1), ...extents);

export const ex = extrudeX;
export const ey = extrudeY;
export const ez = extrudeZ;

Shape.registerMethod('ex', ex);
Shape.registerMethod('ey', ey);
Shape.registerMethod('ez', ez);
