import Point from './Point.js';
import Shape from './Shape.js';
import extrudeAlong from './extrudeAlong.js';

export const extrude = (...extents) => extrudeAlong(Point(0, 0, 1), ...extents);

export const ex = extrude;

Shape.registerMethod('extrude', extrude);
Shape.registerMethod('ex', ex);

export default extrudeAlong;
