import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh =
  (...lengths) =>
  (shape) =>
    Shape.fromGeometry(remeshGeometry(shape.toGeometry(), { lengths }));

Shape.registerMethod('remesh', remesh);
