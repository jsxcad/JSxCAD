import { toPolygon as toPolygonFromPlane } from '@jsxcad/math-plane';

export const fromPlane = (plane) => [toPolygonFromPlane(plane)];
