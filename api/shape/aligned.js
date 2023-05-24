import Shape from './Shape.js';
import alignment from './alignment.js';
import and from './and.js';
import by from './by.js';

export const aligned = Shape.registerMethod2(
  'aligned',
  ['input', 'shape', 'rest'],
  async (input, alignedShape, rest) =>
    and(by(await alignment(...rest)(input))(alignedShape))(input)
);

Shape.registerMethod('aligned', aligned);

export default aligned;
