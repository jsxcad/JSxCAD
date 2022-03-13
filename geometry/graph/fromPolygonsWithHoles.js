import { fromPolygonsWithHolesToTriangles } from './fromPolygonsWithHolesToTriangles.js';
import { fromTriangles } from './fromTriangles.js';

export const fromPolygonsWithHoles = (geometry) =>
  fromTriangles(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromPolygonsWithHolesToTriangles(geometry)
  );
