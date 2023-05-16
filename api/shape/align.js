import Shape from './Shape.js';
import alignment from './alignment.js';
import by from './by.js';

export const align = Shape.registerMethod(
  'align',
  (...args) =>
    async (shape) =>
      by(await alignment(...args)(shape))(shape)
);

Shape.registerMethod('align', align);

export default align;
