import { Shape, fromGeometry } from './Shape.js';

import Group from './Group.js';
import { destructure } from './destructure.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const fuse = Shape.chainable((...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return fromGeometry(
    fuseGeometry(Group(shape, ...shapes).toGeometry(), modes.includes('exact'))
  );
});

Shape.registerMethod('fuse', fuse);
