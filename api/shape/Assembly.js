import Shape from './Shape.js';
import { assemble } from '@jsxcad/geometry';

const isDefined = (value) => value !== undefined;

export const Assembly = (...shapes) =>
  Shape.fromGeometry(
    assemble(...shapes.filter(isDefined).map((shape) => shape.toGeometry()))
  );

export default Assembly;

Shape.prototype.Assembly = Shape.shapeMethod(Assembly);
