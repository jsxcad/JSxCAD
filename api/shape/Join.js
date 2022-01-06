import Shape from './Shape.js';
import { fuse } from '@jsxcad/geometry';

export const Join = (...shapes) =>
  Shape.fromGeometry(fuse(shapes.map((shape) => shape.toGeometry())));

export default Join;

Shape.prototype.Join = Shape.shapeMethod(Join);
