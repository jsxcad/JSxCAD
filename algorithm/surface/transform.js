import { transform as transformPolygon } from '@jsxcad/math-poly3';

export const transform = (matrix, polygons) => polygons.map(polygon => transformPolygon(matrix, polygon));
