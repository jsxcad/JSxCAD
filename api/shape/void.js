import { hasTypeGhost, hasTypeVoid } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const voidFn = Shape.chainable(
  () => (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(shape.toGeometry())))
);

Shape.registerMethod('void', voidFn);
