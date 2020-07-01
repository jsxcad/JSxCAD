import { eachPoint } from './eachPoint.js';

export const toPoints = (options = {}, polygons) => {
  const points = [];
  eachPoint(options, (point) => points.push(point), polygons);
  return points;
};
