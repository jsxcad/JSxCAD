import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { taggedGroup } from '@jsxcad/geometry';

export const And = Shape.registerMethod('And', (...args) => async (shape) => {
  const [geometries] = await destructure2(shape, args, 'geometries');
  return Shape.fromGeometry(taggedGroup({}, ...geometries));
});

export const and = Shape.registerMethod(
  'and',
  (...args) =>
    async (shape) =>
      shape.And(shape, ...args)
);

export default and;
