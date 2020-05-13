import { Shape } from './Shape';
import { rewrite } from '@jsxcad/geometry-tagged';

const noPlan = (shape, tags, select) => {
  const op = (geometry, descend) => {
    if (geometry.plan) {
      return { layers: [] };
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const noPlanMethod = function (...tags) { return noPlan(this, tags); };
Shape.prototype.noPlan = noPlanMethod;
