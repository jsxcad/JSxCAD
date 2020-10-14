import { Shape } from '@jsxcad/api-v1-shape';
import { alphaShape } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

export const Alpha = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(taggedGraph({}, alphaShape(points)));
};

const alphaMethod = function (...shapes) {
  return Alpha(this, ...shapes);
};
Shape.prototype.alpha = alphaMethod;

export default Alpha;
