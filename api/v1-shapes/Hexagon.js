import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Polygon } from './Polygon.js';

export const ofEdge = (edge = 1) => Polygon.ofEdge(edge, { sides: 6 });
export const ofApothem = (apothem = 1) =>
  Polygon.ofApothem(apothem, { sides: 6 });
export const ofRadius = (radius = 1) => Polygon.ofRadius(radius, { sides: 6 });
export const ofDiameter = (diameter = 1) =>
  Polygon.ofDiameter(diameter, { sides: 6 });

export const Hexagon = (...args) => ofRadius(...args);

Hexagon.ofRadius = ofRadius;
Hexagon.ofEdge = ofEdge;
Hexagon.ofApothem = ofApothem;
Hexagon.ofRadius = ofRadius;
Hexagon.ofDiameter = ofDiameter;

export default Hexagon;

Shape.prototype.Hexagon = shapeMethod(Hexagon);
