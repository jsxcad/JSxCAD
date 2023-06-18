import { Shape } from './Shape.js';
import { computeOrientedBoundingBox } from '@jsxcad/geometry';

// Note: the first three segments are notionally 'length', 'depth', 'height'.
// Really this should probably be some kind of 'diameter at an angle' measurement, like using a set of calipers.

export const mark = Shape.registerMethod2(
  'mark',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(computeOrientedBoundingBox(geometry))
);
