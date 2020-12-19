import { isVoid, rewrite, taggedLayers } from '@jsxcad/geometry-tagged';
import { Shape } from './Shape.js';

const noHoles = (shape, tags, select) => {
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

const noHolesMethod = function (...tags) {
  return noHoles(this, tags);
};

Shape.prototype.noHoles = noHolesMethod;
Shape.prototype.noVoid = noHolesMethod;
