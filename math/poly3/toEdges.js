const eachEdge = require('./eachEdge');

/**
 * Converts the polygon to an ordered list of edges.
 *
 * @param {Polygon}
 * @returns {Edges}
 */

const toEdges = (options = {}, polygon) => {
  let edges = [];
  eachEdge({}, (a, b) => edges.push([a, b]), polygon);
  return edges;
};

module.exports = toEdges;
