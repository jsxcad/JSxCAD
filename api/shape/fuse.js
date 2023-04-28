import { Shape, fromGeometry } from './Shape.js';

import Group from './Group.js';
import { Join } from './join.js';
import { destructure } from './destructure.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const Fuse = Join;

export const fuse = Shape.registerMethod('fuse', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return fromGeometry(
    fuseGeometry(
      await Group(shape, ...shapes).toGeometry(),
      modes.includes('exact')
    )
  );
});
