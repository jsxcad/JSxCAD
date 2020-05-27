/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Plane} Plane
 * @typedef {import("./types").Point} Point
 */

// This produces a half-edge link.

/**
 * createEdge
 *
 * @function
 * @param {Point=} start
 * @param {Edge=} face
 * @param {Edge=} next
 * @param {Edge=} twin
 * @param {Array<Edge>=} holes
 * @param {Plane=} plane
 * @param {number=} id
 * @param {boolean=} dead
 * @param {boolean=} spurLinkage
 * @returns {Edge}
 */
export const createEdge = (start = [0, 0, 0], face, next, twin, holes, plane, id, dead, spurLinkage) => ({ start, face, next, twin, holes, plane, id, dead, spurLinkage });

export default createEdge;
