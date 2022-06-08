import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Link = (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(Shape.toShapes(shapes).map((shape) => shape.toGeometry()))
  );

Shape.prototype.Link = Shape.shapeMethod(Link);
Shape.Link = Link;

export default Link;

export const link = Shape.chainable(
  (...shapes) =>
    (shape) =>
      Link([shape, ...shape.toShapes(shapes, shape)])
);

Shape.registerMethod('link', link);
