import { getEdges } from "@jsxcad/geometry-path";

// Expects aligned vertices.

export const findOpenEdges = (solid, isOpen = true) => {
  const test = (closed) => (isOpen ? !closed : closed);

  const edges = new Set();
  for (const surface of solid) {
    for (const face of surface) {
      for (const edge of getEdges(face)) {
        edges.add(JSON.stringify(edge));
      }
    }
  }
  const openEdges = [];
  for (const surface of solid) {
    for (const face of surface) {
      for (const [start, end] of getEdges(face)) {
        if (test(edges.has(JSON.stringify([end, start])))) {
          openEdges.push([start, end]);
        }
      }
    }
  }
  return openEdges;
};
