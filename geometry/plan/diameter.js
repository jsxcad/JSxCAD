export const diameter = (diameter = 1, [x = 0, y = 0, z = 0] = []) => {
  const radius = diameter / 2;
  const left = x - radius;
  const right = x + radius;
  const front = y + radius;
  const back = y - radius;
  const top = z + radius;
  const bottom = z - radius;
  const length = right - left;
  const width = back - front;
  const height = top - bottom;
  const center = [(left + right) / 2, (front + back) / 2, (top + bottom) / 2];
  return {
    type: 'diameter',
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
    diameter,
    center,
  };
};
