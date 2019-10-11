import { Shape } from './Shape';

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

export const Z = (z = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  return Shape.fromPathToZ0Surface([[max, min, z], [max, max, z], [min, max, z], [min, min, z]]);
};
