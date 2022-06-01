import Shape from './Shape.js';
import { fix as fixGeometry } from '@jsxcad/geometry';

export const fix = () => (shape) =>
  Shape.fromGeometry(
    fixGeometry(shape.toGeometry(), /* removeSelfIntersections= */ true)
  );

Shape.registerMethod('fix', fix);
