import Shape from './Shape.js';
import alignment from './alignment.js';
import by from './by.js';

export const align = Shape.registerMethod2(
  'align',
  ['input', 'rest'],
  async (input, rest) => by(await alignment(...rest)(input))(input)
);

export default align;
