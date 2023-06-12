import Shape from './Shape.js';
import { shell as shellGeometry } from '@jsxcad/geometry';

export const shell = Shape.registerMethod2(
  'shell',
  ['inputGeometry', 'modes', 'interval', 'number', 'number', 'options'],
  async (
    geometry,
    modes,
    interval = [1 / -2, 1 / 2],
    sizingFallback,
    approxFallback,
    { angle, sizing = sizingFallback, approx = approxFallback, edgeLength } = {}
  ) => {
    const [innerOffset, outerOffset] = interval;
    return Shape.fromGeometry(
      shellGeometry(
        geometry,
        innerOffset,
        outerOffset,
        modes.includes('protect'),
        angle,
        sizing,
        approx,
        edgeLength
      )
    );
  }
);
