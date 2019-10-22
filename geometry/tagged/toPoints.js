import { createPointNormalizer } from './pointNormalizer';
import { eachPoint } from './eachPoint';

export const toPoints = (options = {}, geometry) => {
  const normalize = createPointNormalizer();
  const points = new Set();
  eachPoint(options, point => points.add(normalize(point)), geometry);
  return { points: [...points] };
};
