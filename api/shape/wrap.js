import { Shape } from './Shape.js';
import { wrap as wrapGeometry } from '@jsxcad/geometry';

export const Wrap = Shape.registerMethod2(
  'Wrap',
  ['input', 'number', 'number', 'geometries'],
  async (input, offset = 1, alpha = 0.1, geometries) =>
    Shape.fromGeometry(wrapGeometry(geometries, offset, alpha)).setTags(
      ...(await input.getTags())
    )
);

export const wrap = Shape.registerMethod2(
  'wrap',
  ['input', 'rest'],
  (input, rest) => Wrap(input, ...rest)(input)
);

export default wrap;
