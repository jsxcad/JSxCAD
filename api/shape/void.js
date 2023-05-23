import { hasTypeGhost, hasTypeVoid } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const voidFn = Shape.registerMethod(
  ['void', 'gap'],
  () => async (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(await shape.toGeometry())))
);

export const gap = voidFn;
