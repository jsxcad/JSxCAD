export const cylinder = (
  radius = 1,
  up = 1,
  down = 0,
  [x = 0, y = 0, z = 0] = []
) => {
  const left = x - radius;
  const right = x + radius;
  const front = y + radius;
  const back = y - radius;
  const top = z + up;
  const bottom = z + down;
  const length = right - left;
  const width = back - front;
  const height = top - bottom;
  const center = [(left + right) / 2, (front + back) / 2, (top + bottom) / 2];
  return {
    type: 'radius',
    left,
    right,
    back,
    front,
    top,
    bottom,
    length,
    width,
    height,
    radius,
    center,
  };
};
