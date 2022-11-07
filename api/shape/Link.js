import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Link = Shape.registerShapeMethod('Link', (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(Shape.toShapes(shapes).map((shape) => shape.toGeometry()))
  ));

export default Link;

export const link = Shape.registerMethod('link',
  (...shapes) =>
    (shape) =>
      Link([shape, ...shape.toShapes(shapes, shape)])
);
