import { eachPoint } from './eachPoint';

export const toPoints = (options = {}, solid) => {
  const points = [];
  eachPoint({}, point => points.push(point), solid);
  return points;
};
