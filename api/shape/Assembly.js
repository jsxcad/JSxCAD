import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { fitTo } from './fitTo.js';

export const Assembly = Shape.registerMethod(
  'Assembly',
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      const [first, ...rest] = shapes;
      return fitTo(modes, ...rest)(first);
    }
);

export default Assembly;
