import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Link = Shape.registerMethod('Link', (...args) => async (shape) => {
  const [modes, geometries] = await destructure2(
    shape,
    args,
    'modes',
    'geometries'
  );
  return Shape.fromGeometry(
    linkGeometry(geometries, modes.includes('close'), modes.includes('reverse'))
  );
});

export default Link;

export const link = Shape.registerMethod(
  'link',
  (...args) =>
    async (shape) =>
      Link(shape, ...args)(shape)
);
