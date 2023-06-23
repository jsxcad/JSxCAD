import Shape from './Shape.js';
import { on } from './on.js';
import { input } from './noOp.js';

export const put = Shape.registerMethod2(
  'put',
  ['input', 'shapes'],
  (input, shapes) => on(input(), shapes)(input)
);
