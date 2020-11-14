import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius.js';

export { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve.js';
export { buildGeodesicSphere } from './buildGeodesicSphere.js';
export { buildPolygonFromPoints } from './buildPolygonFromPoints.js';
export { buildRegularIcosahedron } from './buildRegularIcosahedron.js';
export { buildRegularPolygon } from './buildRegularPolygon.js';
export { buildRingSphere } from './buildRingSphere.js';
export { buildUniformCubicBezierCurve } from './buildUniformCubicBezierCurve.js';
export { loop } from './loop.js';
export { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius.js';
export { simplifyPath } from './simplifyPath.js';
export { subdivideTriangle } from './subdivideTriangle.js';
export { subdivideTriangularMesh } from './subdivideTriangularMesh.js';

export const toRadiusFromApothem = (apothem, sides) =>
  apothem / Math.cos(Math.PI / sides);
export const toRadiusFromEdge = (edge, sides) =>
  edge * regularPolygonEdgeLengthToRadius(1, sides);
