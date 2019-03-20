import { findPolygonsViolations } from './findPolygonsViolations';

export const isWatertightPolygons = polygons => findPolygonsViolations(polygons).length === 0;
