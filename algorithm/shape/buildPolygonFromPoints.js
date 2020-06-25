import { cachePoints } from '@jsxcad/cache';

export const buildPolygonFromPointsImpl = (points) => ({
  surface: [points.map(([x = 0, y = 0, z = 0]) => [x, y, z])],
});

export const buildPolygonFromPoints = cachePoints(buildPolygonFromPointsImpl);
