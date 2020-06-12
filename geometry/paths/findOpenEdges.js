import { getEdges } from "@jsxcad/geometry-path";

// Expects aligned vertices.

export const findOpenEdges = (paths, isOpen) => {
  const test = (closed) => (isOpen ? !closed : closed);

  const edges = new Set();

  for (const path of paths) {
    for (const edge of getEdges(path)) {
      // FIX: serialization should be unnecessary.
      edges.add(JSON.stringify(edge));
    }
  }

  const openEdges = [];
  for (const path of paths) {
    for (const [start, end] of getEdges(path)) {
      if (test(edges.has(JSON.stringify([end, start])))) {
        openEdges.push([start, end]);
      }
    }
  }

  return openEdges;
};
