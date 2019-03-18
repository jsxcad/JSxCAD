/**
 * Transforms the vertices of a polygon, producing a new poly3.
 *
 * The polygon does not need to be a poly3, but may be any array of
 * points. The points being represented as arrays of values.
 *
 * If the original has a 'plane' property, the result will have a clone
 * of the plane.
 *
 * @param {Function} [transform=vec3.clone] - function used to transform the vertices.
 * @returns {Array} a copy with transformed vertices and copied properties.
 *
 * @example
 * const vertices = [ [0, 0, 0], [0, 10, 0], [0, 10, 10] ]
 * let observed = poly3.map(vertices)
 */
export const map = (original, transform) => {
  if (original === undefined) {
    original = [];
  }
  if (transform === undefined) {
    transform = _ => _;
  }
  return original.map(vertex => transform(vertex));
};
