/**
 * @typedef {Array<number>} Plane
 */

/**
 * @typedef {Array<number>} Point
 */

/**
 * @typedef {Array<Point>} Path
 */

/**
 * @typedef {Array<Path>} Surface
 */

/**
 * @typedef {Array<Surface>} Solid
 */

/**
 * @typedef {Array<Path>} Polygons
 */

/*
 * @callback Normalizer
 * @param {Point} point
 * @returns {void}
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
 * @property {Array<Edge>} holes
 * @property {number} id
 * @property {Plane} plane
 * @property {boolean} dead
 * @property {boolean} spurLinkage
 */
export const Edge =
  "{ Point: start, Edge: face, Edge: next, Edge: twin, Array<Edge>: holes, number: id }";

/**
 * @typedef {Array<Edge>} Loops
 */
