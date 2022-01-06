import Shape from './Shape.js';
import { assemble } from '@jsxcad/geometry';

export const Assembly = (...shapes) =>
  Shape.fromGeometry(
    assemble(...Shape.toShapes(shapes).map((shape) => shape.toGeometry()))
  );

export default Assembly;

Shape.prototype.Assembly = Shape.shapeMethod(Assembly);
