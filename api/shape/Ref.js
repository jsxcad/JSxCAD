import Point from './Point.js';
import Shape from './Shape.js';
import { hasTypeReference } from '@jsxcad/geometry';

export const ref = Shape.registerMethod2('ref', ['inputGeometry'], (geometry) =>
  Shape.fromGeometry(hasTypeReference(geometry))
);

export const Ref = Shape.registerMethod2(
  'Ref',
  ['input', 'rest'],
  async (input, rest) => {
    const point = await Point(...rest)(input);
    return ref()(point);
  }
);

export default Ref;
