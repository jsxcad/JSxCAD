import { fromPolygonsWithHolesToTriangles } from './fromPolygonsWithHolesToTriangles.js';
import { fromTriangles } from './fromTriangles.js';

export const fromPolygonsWithHoles = (polygonsWithHoles) =>
  fromTriangles(fromPolygonsWithHolesToTriangles(polygonsWithHoles));
