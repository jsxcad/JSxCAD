import { Shape } from '@jsxcad/api-v1-shape';
import { fromPoints } from '@jsxcad/geometry-graph';
import { taggedGraph } from '@jsxcad/geometry-tagged';

export const cloudSolid = (shape) => {
  const points = shape.toPoints();
  return Shape.fromGeometry(taggedGraph({}, fromPoints(points)));
};

const cloudSolidMethod = function () {
  return cloudSolid(this);
};
Shape.prototype.cloudSolid = cloudSolidMethod;

const withCloudSolidMethod = function () {
  return this.with(cloudSolid(this));
};
Shape.prototype.withCloudSolid = withCloudSolidMethod;

export default cloudSolid;
