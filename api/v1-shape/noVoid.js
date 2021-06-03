import { isVoid, rewrite, taggedLayers } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

const noVoid = (shape, tags, select) => {
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

const noVoidMethod = function (...tags) {
  return noVoid(this, tags);
};

Shape.prototype.noVoid = noVoidMethod;
