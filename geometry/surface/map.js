/**
 * Transforms each polygon of the surface.
 *
 * @param {Polygons} original - the Polygons to transform.
 * @param {Function} [transform=identity] - function used to transform the polygons.
 * @returns {Polygons} a copy with transformed polygons.
 */
export const map = (original, transform) => {
  if (original === undefined) {
    original = [];
  }
  if (transform === undefined) {
    transform = _ => _;
  }
  return original.map(polygon => transform(polygon));
};
