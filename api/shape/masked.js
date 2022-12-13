import Group from './Group.js';
import Shape from './Shape.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masked = Shape.registerMethod(
  'masked',
  (...args) =>
    async (shape) => {
      const shapes = [];
      for (const arg of args) {
        const s = await shape.toShape(arg);
        shapes.push(await s.void());
      }
      return Group(
        ...shapes,
        Shape.fromGeometry(hasTypeMasked(await shape.toGeometry()))
      );
    }
);

export default masked;
