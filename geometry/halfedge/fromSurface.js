/** @module @jsxcad/geometry-halfedge/fromSurface */

/**
 * @typedef {import("./types").Loops} Loops
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Surface} Surface
 */

import fromSolid from './fromSolid';

/**
 * fromSurface
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
export const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

export default fromSurface;
