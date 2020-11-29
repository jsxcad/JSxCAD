import { Shape } from '@jsxcad/api-v1-shape';
import { alphaShape } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

export const Alpha = (shape, componentLimit = 1) => {
  const points = [];
  shape.eachPoint((point) => points.push(point));
  return Shape.fromGeometry(
    taggedGraph({}, alphaShape(points, componentLimit))
  );
};

const alphaMethod = function (componentLimit = 1) {
  return Alpha(this, componentLimit);
};
Shape.prototype.alpha = alphaMethod;

export default Alpha;
