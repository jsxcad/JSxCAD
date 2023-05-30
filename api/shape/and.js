import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const And = Shape.registerMethod2('And', ['geometries'], (geometries) =>
  Shape.fromGeometry(taggedGroup({}, ...geometries))
);

export const and = Shape.registerMethod2(
  'and',
  ['input', 'shapes'],
  (input, shapes) => input.And(input, ...shapes)
);

export default and;
