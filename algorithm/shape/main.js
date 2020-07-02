import { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve.js';
import { buildConvexHull } from './buildConvexHull.js';
import { buildConvexMinkowskiSum } from './buildConvexMinkowskiSum.js';
import { buildConvexSurfaceHull } from './buildConvexSurfaceHull.js';
import { buildFromFunction } from './buildFromFunction.js';
import { buildFromSlices } from './buildFromSlices.js';
import { buildGeodesicSphere } from './buildGeodesicSphere.js';
import { buildPolygonFromPoints } from './buildPolygonFromPoints.js';
import { buildRegularIcosahedron } from './buildRegularIcosahedron.js';
import { buildRegularPolygon } from './buildRegularPolygon.js';
import { buildRegularPrism } from './buildRegularPrism.js';
import { buildRegularTetrahedron } from './buildRegularTetrahedron.js';
import { buildRingSphere } from './buildRingSphere.js';
import { buildUniformCubicBezierCurve } from './buildUniformCubicBezierCurve.js';
import { extrude } from './extrude.js';
import { loop } from './loop.js';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius.js';
import { simplifyPath } from './simplifyPath.js';
import { subdivideTriangle } from './subdivideTriangle.js';
import { subdivideTriangularMesh } from './subdivideTriangularMesh.js';

export const toRadiusFromApothem = (apothem, sides) =>
  apothem / Math.cos(Math.PI / sides);
export const toRadiusFromEdge = (edge, sides) =>
  edge * regularPolygonEdgeLengthToRadius(1, sides);

export {
  buildAdaptiveCubicBezierCurve,
  buildConvexHull,
  buildConvexMinkowskiSum,
  buildConvexSurfaceHull,
  buildFromFunction,
  buildFromSlices,
  buildGeodesicSphere,
  buildPolygonFromPoints,
  buildRegularIcosahedron,
  buildRegularPolygon,
  buildRegularPrism,
  buildRegularTetrahedron,
  buildRingSphere,
  buildUniformCubicBezierCurve,
  extrude,
  loop,
  regularPolygonEdgeLengthToRadius,
  simplifyPath,
  subdivideTriangle,
  subdivideTriangularMesh,
};
