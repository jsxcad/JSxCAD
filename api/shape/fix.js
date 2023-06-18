import Shape from './Shape.js';
import { fix as fixGeometry } from '@jsxcad/geometry';

export const fix = Shape.registerMethod('fix', ['inputGeometry'], (geometry) =>
  Shape.fromGeometry(fixGeometry(geometry, /* removeSelfIntersections= */ true))
);
