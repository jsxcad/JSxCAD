/**
 * Emits the edges of a polygon in order.
 *
 * @param {function} the function to call with each edge in order.
 * @param {Polygon} the polygon of which to emit the edges.
 */

export const eachEdge = (options = {}, thunk, polygon) => {
  if (polygon.length >= 2) {
    for (let nth = 1; nth < polygon.length; nth++) {
      thunk(polygon[nth - 1], polygon[nth]);
    }
    thunk(polygon[polygon.length - 1], polygon[0]);
  }
};
