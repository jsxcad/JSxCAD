import { createPointNormalizer } from './pointNormalizer';
import { eachPoint } from './eachPoint';

export const toPoints = (geometry) => {
  const normalize = createPointNormalizer();
  const points = new Set();
  eachPoint((point) => points.add(normalize(point)), geometry);
  return { type: 'points', points: [...points] };
};
