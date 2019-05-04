import { eachPoint } from './eachPoint';

export const toPoints = (options = {}, paths) => {
  const points = [];
  eachPoint(options, point => points.push(point), paths);
  return points;
};
