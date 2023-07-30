import { Group, translate } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const z = Shape.registerMethod3(
  'z',
  ['inputGeometry', 'numbers'],
  async (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [0, 0, offset]));
    }
    return Group(moved);
  }
);
