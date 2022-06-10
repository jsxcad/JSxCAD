import { isTypeVoid, rewrite, taggedGroup } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

export const noVoid = Shape.chainable((tags, select) => (shape) => {
  const op = (geometry, descend) => {
    if (isTypeVoid(geometry)) {
      return taggedGroup({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toDisjointGeometry(), op);
  return Shape.fromGeometry(rewritten);
});

Shape.registerMethod('noVoid', noVoid);
