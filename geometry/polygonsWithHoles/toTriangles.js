import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { toTriangles as toTrianglesFromGraph } from '../graph/toTriangles.js';

export const toTriangles = (geometry) =>
  toTrianglesFromGraph(
    { tags: geometry.tags },
    fromPolygonsWithHolesToGraph(geometry)
  );
