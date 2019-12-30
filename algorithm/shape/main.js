import { buildAdaptiveCubicBezierCurve } from './buildAdaptiveCubicBezierCurve';
import { buildConvexHull } from './buildConvexHull';
import { buildConvexMinkowskiSum } from './buildConvexMinkowskiSum';
import { buildConvexSurfaceHull } from './buildConvexSurfaceHull';
import { buildFromFunction } from './buildFromFunction';
import { buildFromSlices } from './buildFromSlices';
import { buildGeodesicSphere } from './buildGeodesicSphere';
import { buildPolygonFromPoints } from './buildPolygonFromPoints';
import { buildRegularIcosahedron } from './buildRegularIcosahedron';
import { buildRegularPolygon } from './buildRegularPolygon';
import { buildRegularPrism } from './buildRegularPrism';
import { buildRegularTetrahedron } from './buildRegularTetrahedron';
import { buildRingSphere } from './buildRingSphere';
import { buildUniformCubicBezierCurve } from './buildUniformCubicBezierCurve';
import { extrude } from './extrude';
import { lathe } from './lathe';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius';
import { simplifyPath } from './simplifyPath';
import { subdivideTriangle } from './subdivideTriangle';
import { subdivideTriangularMesh } from './subdivideTriangularMesh';

export const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);
export const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

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
  lathe,
  regularPolygonEdgeLengthToRadius,
  simplifyPath,
  subdivideTriangle,
  subdivideTriangularMesh
};
