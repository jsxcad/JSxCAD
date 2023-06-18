import Group from './Group.js';
import Shape from './Shape.js';
import { gap } from './void.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masked = Shape.registerMethod2(
  'masked',
  ['inputGeometry', 'shapes'],
  async (geometry, masks) => {
    const shapes = [];
    for (const mask of masks) {
      shapes.push(await gap()(mask));
    }
    return Group(...shapes, Shape.fromGeometry(hasTypeMasked(geometry)));
  }
);

export default masked;
