import { hasTypeGhost, hasTypeVoid } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const voidFn = Shape.registerMethod(
  'void',
  () => (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(shape.toGeometry())))
);
