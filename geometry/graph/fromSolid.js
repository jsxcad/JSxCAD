import { fromPolygons, toGraph } from '@jsxcad/algorithm-occt';

export const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  const shape = fromPolygons(polygons);
  const graph = toGraph(shape);
  return graph;
};
