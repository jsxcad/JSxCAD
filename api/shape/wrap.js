import { Shape } from './Shape.js';
import { destructure2 } from './destructure.js';
import { wrap as wrapGeometry } from '@jsxcad/geometry';

export const Wrap = Shape.registerMethod('Wrap', (...args) => async (shape) => {
  const [offset = 1, alpha = 0.1, shapes] = await destructure2(
    shape,
    args,
    'number',
    'number',
    'shapes'
  );
  return Shape.fromGeometry(
    wrapGeometry(await shape.toShapesGeometries(shapes), offset, alpha)
  ).setTags(...(await shape.getTags()));
});

export const wrap = Shape.registerMethod(
  'wrap',
  (...args) =>
    async (shape) =>
      Wrap(shape, ...args)(shape)
);

export default wrap;
