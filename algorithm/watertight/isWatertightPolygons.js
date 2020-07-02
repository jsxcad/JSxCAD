import { findPolygonsViolations } from './findPolygonsViolations.js';

export const isWatertightPolygons = (polygons) =>
  findPolygonsViolations(polygons).length === 0;
