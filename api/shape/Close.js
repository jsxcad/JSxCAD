import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Close = (...shapes) =>
    Shape.fromGeometry(
      linkGeometry(Shape.toShapes(shapes).map(shape => shape.toGeometry()), /*close=*/ true)
    );

Shape.prototype.Close = Shape.shapeMethod(Close);
Shape.Close = Close;

export default Close;

export const close = (...shapes) => (shape) => Close(shape, ...shape.toShapes(shapes, shape));

Shape.registerMethod('close', close);
