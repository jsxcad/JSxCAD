const { eachEdge } = require('@jsxcad/math-poly3');
const ensureMapElement = require('./ensureMapElement');
const findVertexViolations = require('./findVertexViolations');

const toIdentity = JSON.stringify;

const findPolygonsViolations = polygons => {
  // A map from vertex value to connected edges represented as an array in
  // the form [start, ...end].
  const edges = new Map();
  const addEdge = (start, end) => ensureMapElement(edges, toIdentity(start), () => [start]).push(end);
  const addEdges = (start, end) => { addEdge(start, end); addEdge(end, start); };
  polygons.forEach(polygon => eachEdge({}, addEdges, polygon));

  // Edges are assembled, check for matches
  let violations = [];
  edges.forEach(vertex => {
    violations = [].concat(violations, findVertexViolations(...vertex));
  });

  return violations;
};

module.exports = findPolygonsViolations;
