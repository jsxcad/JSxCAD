import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const link = (...shapes) => (shape) =>
  Shape.fromGeometry(linkGeometry([shape.toGeometry(), ...shape.toShapes(shapes, shape).map(shape => shape.toGeometry())]));

Shape.registerMethod('link', link);
