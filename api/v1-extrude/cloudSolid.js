import { fromPointsToGraph, taggedGraph } from '@jsxcad/geometry';

import { Shape } from '@jsxcad/api-v1-shape';

export const cloudSolid = (shape) => {
  const points = shape.toPoints();
  return Shape.fromGeometry(taggedGraph({}, fromPointsToGraph(points)));
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
