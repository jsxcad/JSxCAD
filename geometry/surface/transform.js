import { cacheTransform } from "@jsxcad/cache";
import { transform as transformPolygon } from "@jsxcad/math-poly3";

const transformImpl = (matrix, polygons) =>
  polygons.map((polygon) => transformPolygon(matrix, polygon));

export const transform = cacheTransform(transformImpl);
