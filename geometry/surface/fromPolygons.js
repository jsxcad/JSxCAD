import { makeConvex } from './makeConvex.js';

export const fromPolygons = ({ plane }, polygons) => makeConvex(polygons);
