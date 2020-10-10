import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  buildPolygonFromPoints,
  buildRegularPolygon,
  regularPolygonEdgeLengthToRadius,
  toRadiusFromApothem,
} from '@jsxcad/algorithm-shape';

import { taggedZ0Surface } from '@jsxcad/geometry-tagged';

const unitPolygon = (sides = 16) =>
  Shape.fromGeometry(taggedZ0Surface({}, [buildRegularPolygon(sides)]));

// Note: radius here is circumradius.
const toRadiusFromEdge = (edge, sides) =>
  edge * regularPolygonEdgeLengthToRadius(1, sides);

export const ofRadius = (radius, { sides = 16 } = {}) =>
  unitPolygon(sides).scale(radius);
export const ofEdge = (edge, { sides = 16 }) =>
  ofRadius(toRadiusFromEdge(edge, sides), { sides });
export const ofApothem = (apothem, { sides = 16 }) =>
  ofRadius(toRadiusFromApothem(apothem, sides), { sides });
export const ofDiameter = (diameter, ...args) =>
  ofRadius(diameter / 2, ...args);
export const ofPoints = (points) =>
  Shape.fromGeometry(buildPolygonFromPoints(points));

export const Polygon = (...args) => ofRadius(...args);

Polygon.ofEdge = ofEdge;
Polygon.ofApothem = ofApothem;
Polygon.ofRadius = ofRadius;
Polygon.ofDiameter = ofDiameter;
Polygon.ofPoints = ofPoints;
Polygon.toRadiusFromApothem = toRadiusFromApothem;

export default Polygon;

Shape.prototype.Polygon = shapeMethod(Polygon);
