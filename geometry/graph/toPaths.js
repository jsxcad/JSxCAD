import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const toPaths = (geometry) => {
  const paths = [];
  for (const { points, holes } of toPolygonsWithHoles(geometry)) {
    paths.push(points);
    for (const { points } of holes) {
      paths.push(points);
    }
  }
  return paths;
};
