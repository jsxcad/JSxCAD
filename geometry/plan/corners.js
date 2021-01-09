export const corners = (right = 0, back = 0, left = 0, front = 0) => {
  if (left > right) [left, right] = [right, left];
  if (front > back) [front, back] = [back, front];
  return {
    type: 'corners',
    _left: left,
    _right: right,
    _back: back,
    _front: front,
    _at: [0, 0, 0],
  };
};
