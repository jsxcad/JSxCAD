export const box = (
  right = 0,
  back = 0,
  top = 0,
  left = 0,
  front = 0,
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
