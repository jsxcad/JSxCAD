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

Hexagon.signature = 'Hexagon(radius:number = 1) -> Shape';
Hexagon.ofRadius.signature = 'Hexagon.ofRadius(radius:number = 1) -> Shape';
Hexagon.ofDiameter.signature =
  'Hexagon.ofDiameter(diameter:number = 1) -> Shape';
Hexagon.ofApothem.signature = 'Hexagon.ofApothem(apothem:number = 1) -> Shape';
Hexagon.ofEdge.signature = 'Hexagon.ofEdge(edge:number = 1) -> Shape';
