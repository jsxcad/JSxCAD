import Shape from './Shape.js';
import { input as inputOp } from './noOp.js';
import { on } from './on.js';

export const put = Shape.registerMethod2(
  'put',
  ['input', 'shapes'],
  (input, shapes) => on(inputOp(), shapes)(input)
);
