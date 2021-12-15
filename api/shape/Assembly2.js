import Shape from './Shape.js';
import { assemble2 } from '@jsxcad/geometry';

const isDefined = (value) => value !== undefined;

export const Assembly2 = (...shapes) =>
  Shape.fromGeometry(
    assemble2(...shapes.filter(isDefined).map((shape) => shape.toGeometry()))
  );

export default Assembly2;

Shape.prototype.Assembly2 = Shape.shapeMethod(Assembly2);
