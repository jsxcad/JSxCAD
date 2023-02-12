import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { dilateXY as dilateXYGeometry } from '@jsxcad/geometry';

export const dilateXY = Shape.registerMethod(
  'dilateXY',
  (...args) =>
    async (shape) => {
      const [amount = 1] = await destructure2(shape, args, 'number');
      return Shape.fromGeometry(
        dilateXYGeometry(await shape.toGeometry(), amount)
      );
    }
);
