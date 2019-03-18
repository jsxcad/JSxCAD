/**
 * @param {Array[]} vertices - list of vertices
 * @param {plane} [plane] - plane of the polygon
 */
export const fromPointsAndPlane = (vertices, plane) => {
  const out = [...vertices];
  out.plane = plane;
  return out;
};
