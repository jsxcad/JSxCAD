import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const close = (...shapes) => (shape) =>
  Shape.fromGeometry(linkGeometry([shape.toGeometry(), ...shape.toShapes(shapes, shape).map(shape => shape.toGeometry())], /* close= */ true));

Shape.registerMethod('close', close);
