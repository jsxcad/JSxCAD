import { hasTypeGhost, hasTypeVoid } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const voidFn = Shape.registerMethod2(
  ['void', 'gap'],
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasTypeGhost(hasTypeVoid(geometry)))
);

export const gap = voidFn;
