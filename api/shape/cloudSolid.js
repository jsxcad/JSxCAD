import { Shape } from './Shape.js';
import { fromPointsToGraph } from '@jsxcad/geometry';

export const cloudSolid = () => (shape) => {
  const points = shape.toPoints();
  return Shape.fromGeometry(fromPointsToGraph({}, points));
};

Shape.registerMethod('cloudSolid', cloudSolid);

export const withCloudSolid = () => (shape) => shape.with(cloudSolid(shape));

Shape.registerMethod('withCloudSolid', withCloudSolid);

export default cloudSolid;
