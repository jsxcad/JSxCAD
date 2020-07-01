import { eachPoint } from './eachPoint.js';

export const toPoints = (surface) => {
  const points = [];
  eachPoint((point) => points.push(point), surface);
  return points;
};
