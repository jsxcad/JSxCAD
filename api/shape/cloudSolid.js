import { fromPointsToGraph, taggedGraph } from '@jsxcad/geometry';

import { Shape } from './Shape.js';

export const cloudSolid = () => (shape) => {
  const points = shape.toPoints();
  return Shape.fromGeometry(taggedGraph({}, fromPointsToGraph(points)));
};

Shape.registerMethod('cloudSolid', cloudSolid);

export const withCloudSolid = () => (shape) => shape.with(cloudSolid(shape));

Shape.registerMethod('withCloudSolid', withCloudSolid);

export default cloudSolid;
