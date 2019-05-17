import { eachPoint } from './eachPoint';

export const toPoints = (options = {}, geometry) => {
  const points = [];
  eachPoint(options, point => points.push(point), geometry);
  return { points };
};
