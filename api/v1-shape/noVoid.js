import { isVoid, rewrite } from '@jsxcad/geometry-tagged';
import { Shape } from './Shape';

const noVoid = (shape, tags, select) => {
  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return { type: 'layers', content: [] };
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const noVoidMethod = function (...tags) {
  return noVoid(this, tags);
};
Shape.prototype.noVoid = noVoidMethod;
