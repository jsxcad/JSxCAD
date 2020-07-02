import { eachPoint } from './eachPoint.js';

export const toPoints = (solid) => {
  const points = [];
  eachPoint((point) => points.push(point), solid);
  return points;
};
