import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const toPaths = (graph) => {
  const paths = [];
  for (const { points, holes } of toPolygonsWithHoles(graph)) {
    paths.push(points);
    for (const { points } of holes) {
      paths.push(points);
    }
  }
  return paths;
};
