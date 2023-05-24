import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { gap } from './void.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masked = Shape.registerMethod(
  'masked',
  (...args) =>
    async (shape) => {
      const [masks] = await destructure2(shape, args, 'shapes');
      const shapes = [];
      for (const mask of masks) {
        shapes.push(await gap()(mask));
      }
      return Group(
        ...shapes,
        Shape.fromGeometry(hasTypeMasked(await shape.toGeometry()))
      );
    }
);

export default masked;
