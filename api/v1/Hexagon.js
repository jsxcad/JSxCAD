import { Polygon } from './Polygon';

/**
 *
 * # Hexagon
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Hexagon()
 * ```
 * :::
 * ::: illustration
 * ```
 * Hexagon(20)
 * ```
 * :::
 **/

export const ofEdge = (edge) => Polygon.ofEdge(edge, 6);
export const ofApothem = (apothem) => Polygon.ofApothem(apothem, 6);
export const ofRadius = (radius) => Polygon.ofRadius(radius, 6);
export const ofDiameter = (diameter) => Polygon.ofDiameter(diameter, 6);

export const Hexagon = (...args) => ofRadius(...args);

Hexagon.ofRadius = ofRadius;
Hexagon.ofEdge = ofEdge;
Hexagon.ofApothem = ofApothem;
Hexagon.ofRadius = ofRadius;
Hexagon.ofDiameter = ofDiameter;

export default Hexagon;
