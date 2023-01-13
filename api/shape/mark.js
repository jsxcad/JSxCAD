import { Shape } from './Shape.js';
import { computeOrientedBoundingBox } from '@jsxcad/geometry';

// Note: the first three segments are notionally 'length', 'depth', 'height'.

export const mark = Shape.registerMethod('mark', () => async (shape) => {
  return Shape.fromGeometry(
    computeOrientedBoundingBox(await shape.toGeometry())
  );
});
