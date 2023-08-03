import { Group, translate } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const y = Shape.registerMethod3(
  'y',
  ['inputGeometry', 'numbers'],
  (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [0, offset, 0]));
    }
    return Group(moved);
  }
);
