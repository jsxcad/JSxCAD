const X = 0;
const Y = 1;

/**
 * Measure the area of a path as though it were a polygon.
 * A negative area indicates a clockwise path, and a positive area indicates a counter-clock-wise path.
 * See: http://mathworld.wolfram.com/PolygonArea.html
 * @returns {Number} The area the path would have if it were a polygon.
 */
export const measureArea = (path) => {
  let last = path.length - 1;
  let current = (path[0] === null) ? 1 : 0;
  let twiceArea = 0;
  for (; current < path.length; last = current++) {
    twiceArea += path[last][X] * path[current][Y] - path[last][Y] * path[current][X];
  }
  return twiceArea / 2;
};
