import { Shape, fromGeometry } from './Shape.js';

import Group from './Group.js';
import { Join } from './join.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const Fuse = Join;

export const fuse = Shape.registerMethod2(
  'fuse',
  ['input', 'shapes', 'modes:exact'],
  async (input, shapes, modes) =>
    fromGeometry(
      fuseGeometry(
        await Group(input, ...shapes).toGeometry(),
        modes.includes('exact')
      )
    )
);
