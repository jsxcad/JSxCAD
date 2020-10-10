import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Polygon from './Polygon.js';

export const ofEdge = (edge = 1, { sides = 32 } = {}) =>
  Polygon.ofEdge(edge, { sides });

export const ofRadius = (radius = 1, { sides = 32 } = {}) =>
  Polygon.ofRadius(radius, { sides });

export const ofApothem = (apothem = 1, { sides = 32 } = {}) =>
  Polygon.ofApothem(apothem, { sides });

export const ofDiameter = (diameter = 1, { sides = 32 } = {}) =>
  Polygon.ofDiameter(diameter, { sides });

export const Circle = (...args) => ofRadius(...args);

Circle.ofEdge = ofEdge;
Circle.ofApothem = ofApothem;
Circle.ofRadius = ofRadius;
Circle.ofDiameter = ofDiameter;
Circle.toRadiusFromApothem = (radius = 1, sides = 32) =>
  Polygon.toRadiusFromApothem(radius, sides);

export default Circle;

Shape.prototype.Circle = shapeMethod(Circle);
