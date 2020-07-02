import { eachPoint } from './eachPoint.js';

export const toPoints = (paths) => {
  const points = [];
  eachPoint((point) => points.push(point), paths);
  return points;
};
