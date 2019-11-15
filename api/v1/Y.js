import { Shape } from './Shape';

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

export const Y = (y = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  return Shape.fromPathToZ0Surface([[max, y, min], [max, y, max], [min, y, max], [min, y, min]]);
};

export default Y;
