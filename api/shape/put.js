import Shape from './Shape.js';
import { on } from './on.js';
import { self } from './self.js';

export const put = Shape.registerMethod2(
  'put',
  ['input', 'shapes'],
  (input, shapes) => on(self(), shapes)(input)
);
