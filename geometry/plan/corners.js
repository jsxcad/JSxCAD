export const corners = (right = 0, back = 0, left = 0, front = 0) => {
  if (left > right) [left, right] = [right, left];
  if (front > back) [front, back] = [back, front];
  const center = [(left + right) / 2, (front + back) / 2, 0];
  return {
    type: 'corners',
    left,
    right,
    back,
    front,
    center,
  };
};
