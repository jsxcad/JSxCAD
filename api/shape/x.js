import { Group, translate } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const x = Shape.registerMethod3(
  'x',
  ['inputGeometry', 'numbers'],
  (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [offset, 0, 0]));
    }
    return Group(moved);
  }
);
