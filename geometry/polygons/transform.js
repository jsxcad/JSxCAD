import { transform as transformOfPoly3 } from '@jsxcad/math-poly3';

export const transform = (matrix, polygons) => polygons.map(polygon => transformOfPoly3(matrix, polygon));
