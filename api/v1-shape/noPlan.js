import { rewrite, taggedLayers } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape.js';

const noPlan = (shape, tags, select) => {
  const op = (geometry, descend) => {
    if (geometry.plan) {
      return taggedLayers({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const noPlanMethod = function (...tags) {
  return noPlan(this, tags);
};
Shape.prototype.noPlan = noPlanMethod;
