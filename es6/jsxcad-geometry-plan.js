// This one is a little trickier, as the construction should fit around the apothem, not within it.
// But the ideal boundary remains the same.

const apothem = (apothem = 1, [x = 0, y = 0, z = 0] = []) => {
  const left = x - apothem;
  const right = x + apothem;
  const front = y + apothem;
  const back = y - apothem;
  const top = z + apothem;
  const bottom = z - apothem;
  const length = right - left;
  const width = back - front;
  const height = top - bottom;
  const center = [(left + right) / 2, (front + back) / 2, (top + bottom) / 2];
  return {
    type: 'apothem',
    left,
    right,
    back,
    front,
    top,
    bottom,
    length,
    width,
    height,
    apothem,
    center,
  };
};

const box = (
  left = 0,
  right = 0,
  back = 0,
  front = 0,
  top = 0,
  bottom = 0
) => {
  if (left > right) [left, right] = [right, left];
  if (front > back) [front, back] = [back, front];
  if (top > bottom) [top, bottom] = [bottom, top];
  const length = right - left;
  const width = back - front;
  const height = top - bottom;
  const center = [(left + right) / 2, (front + back) / 2, (top + bottom) / 2];
  return {
    type: 'box',
    left,
    right,
    back,
    front,
    top,
    bottom,
    length,
    width,
    height,
    center,
  };
};

const cylinder = (
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

const diameter = (diameter = 1, [x = 0, y = 0, z = 0] = []) => {
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

const radius = (radius = 1, [x = 0, y = 0, z = 0] = []) => {
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

export { apothem, box, cylinder, diameter, radius };
