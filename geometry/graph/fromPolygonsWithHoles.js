import { fromPolygonsWithHolesToTriangles } from './fromPolygonsWithHolesToTriangles.js';
import { fromTriangles } from './fromTriangles.js';

export const fromPolygonsWithHoles = ({ tags }, polygonsWithHoles) =>
  fromTriangles({ tags }, fromPolygonsWithHolesToTriangles(polygonsWithHoles));
