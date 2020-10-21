// This one is a little trickier, as the construction should fit around the apothem, not within it.
// But the ideal boundary remains the same.

export const apothem = (apothem = 1, [x = 0, y = 0, z = 0] = []) => {
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
