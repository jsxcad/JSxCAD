import { hasTypeGhost, hasTypeVoid } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const voidFn = Shape.registerMethod(
  'void',
  () => async (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(await shape.toGeometry())))
);
