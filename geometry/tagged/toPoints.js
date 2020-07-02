import { createPointNormalizer } from './pointNormalizer.js';
import { eachPoint } from './eachPoint.js';

export const toPoints = (geometry) => {
  const normalize = createPointNormalizer();
  const points = new Set();
  eachPoint((point) => points.add(normalize(point)), geometry);
  return { type: 'points', points: [...points] };
};
