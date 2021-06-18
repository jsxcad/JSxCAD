import { toPolygonsWithHoles } from './toPolygonsWithHoles.js';

export const toPaths = (geometry) => {
  const paths = [];
  for (const { polygonsWithHoles } of toPolygonsWithHoles(geometry)) {
    for (const { points, holes } of polygonsWithHoles) {
      paths.push(points);
      for (const { points } of holes) {
        paths.push(points);
      }
    }
  }
  return paths;
};
