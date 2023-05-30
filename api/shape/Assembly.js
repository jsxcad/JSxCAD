import Shape from './Shape.js';
import { fitTo } from './fitTo.js';

export const Assembly = Shape.registerMethod2(
  'Assembly',
  ['shapes', 'modes'],
  (shapes, modes) => {
    const [first, ...rest] = shapes;
    return fitTo(modes, ...rest)(first);
  }
);

export default Assembly;
