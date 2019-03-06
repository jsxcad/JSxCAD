/**
 * Makes a new copy of the geometry that is initially equal to the old.
 * @param {surface} surface - the surface to canonicalize.
 * @returns {surface} a distinct new surface, equal to the old surface.
 */
export const clone = surface => Object.assign({}, surface);
