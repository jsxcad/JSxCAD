import { isVoid, rewrite, taggedLayers } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

export const noVoid = (tags, select) => (shape) => {
  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return taggedLayers({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toDisjointGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

Shape.registerMethod('noVoid', noVoid);
