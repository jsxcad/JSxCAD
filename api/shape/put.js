import Shape from './Shape.js';
import { on } from './on.js';
import { self } from './self.js';

export const put = Shape.registerMethod(
  'put',
  (...shapes) =>
    async (shape) =>
      on(self(), shapes)(shape)
);
