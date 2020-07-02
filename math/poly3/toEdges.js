import { eachEdge } from './eachEdge.js';

/**
 * Converts the polygon to an ordered list of edges.
 *
 * @param {Polygon}
 * @returns {Edges}
 */

export const toEdges = (options = {}, polygon) => {
  let edges = [];
  eachEdge({}, (a, b) => edges.push([a, b]), polygon);
  return edges;
};
