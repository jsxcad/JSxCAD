import { eachPoint } from './eachPoint.js';
import { taggedPoints } from './tagged/taggedPoints.js';

export const toPoints = (geometry) => {
  const points = [];
  eachPoint(geometry, (point) => points.push(point));
  return taggedPoints({}, points);
};
