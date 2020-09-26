/** @typedef {number[]} Plane */
/** @typedef {number[]} Point */
/** @typedef {Point[]} Path */
/** @typedef {Path[]} Surface */
/** @typedef {Surface[]} Solid */
/** @typedef {Path[]} Polygons */

/**
 * @callback Normalizer
 * @param {Point} point
 * @returns {undefined}
 */

/** @typedef {function(Point): Point} Normalizer */

/**
 * @callback PointSelector
 * @param {Point} point
 * @returns {boolean}
 */

/**
 * @typedef {object} Edge
 * @property {Point} start
 * @property {Edge} face
 * @property {Edge} next
 * @property {Edge} twin
 * @property {Edge[]} holes
 * @property {number} id
 * @property {Plane} plane
 * @property {boolean} dead
 * @property {boolean} spurLinkage
 */

/** @typedef {Edge} Loop */
/** @typedef {Loop[]} Loops */
