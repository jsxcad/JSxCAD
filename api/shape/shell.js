import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { shell as shellGeometry } from '@jsxcad/geometry';

export const shell = Shape.registerMethod(
  'shell',
  (...args) =>
    async (shape) => {
      const [
        modes,
        interval = [1 / -2, 1 / 2],
        sizingFallback,
        approxFallback,
        options = {},
      ] = await destructure2(
        shape,
        args,
        'modes',
        'interval',
        'number',
        'options'
      );
      // Application of angle and edgeLength is unclear.
      const {
        angle,
        sizing = sizingFallback,
        approx = approxFallback,
        edgeLength,
      } = options;
      const [innerOffset, outerOffset] = interval;
      return Shape.fromGeometry(
        shellGeometry(
          await shape.toGeometry(),
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
