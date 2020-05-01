/* @module Types */

/**
 * @typedef {Array<number>} Plane
 */
// export const Plane = 'Array<number>';

/**
 * @typedef {Array<number>} Point
 */
// export const Point = 'Array<number>';

/**
 * @typedef {Array<Point>} Path
 */
// export const Path = 'Array<Point>';

/**
 * @typedef {Array<Path>} Surface
 */
// export const Surface = 'Array<Path>';

/**
 * @typedef {Array<Surface>} Solid
 */
// export const Solid = 'Array<Surface>';
// export const Solid = undefined;

/**
 * @typedef {Array<Path>} Polygons
 */
// export const Polygons = 'Array<Path>';

/*
 * @callback Normalizer
 * @param {Point} point
 * @returns {void}
 */

/** @typedef {function(Point): Point} Normalizer */
// export const Normalizer = 'Point => Point';

/**
 * @callback PointSelector
 * @param {Point} point
 * @returns {Boolean}
 */
// export const PointSelector = 'Point to Boolean';

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
export const Edge = '{ Point: start, Edge: face, Edge: next, Edge: twin, Array<Edge>: holes, number: id }';

/**
 * @typedef {Array<Edge>} Loops
 */
// export const Loops = 'Array<Edge>';
