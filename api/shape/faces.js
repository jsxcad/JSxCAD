import Shape from './Shape.js';
import { faces as facesOfGeometry } from '@jsxcad/geometry';

export const faces =
  (op = (s) => s) =>
  (shape) =>
    Shape.fromGeometry(facesOfGeometry(shape.toGeometry())).each(op);

Shape.registerMethod('faces', faces);

export default faces;
