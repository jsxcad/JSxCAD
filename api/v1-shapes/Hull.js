import { Shape } from '@jsxcad/api-v1-shape';
import { convexHull } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

export const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(taggedGraph({}, convexHull(points)));
};

const hullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};
Shape.prototype.hull = hullMethod;

export default Hull;
