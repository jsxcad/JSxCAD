import Shape from './Shape.js';
import { fitTo } from './fitTo.js';

export const Assembly = Shape.registerMethod2(
  'Assembly',
  ['shapes', 'modes'],
  ([first, ...rest], modes) =>
    fitTo(modes, ...rest)(first);
);

export default Assembly;
