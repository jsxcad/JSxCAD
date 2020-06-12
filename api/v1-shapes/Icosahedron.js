import Shape from "@jsxcad/api-v1-shape";
import { buildRegularIcosahedron } from "@jsxcad/algorithm-shape";

/**
 *
 * # Icosahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Icosahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Icosahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitIcosahedron = () =>
  Shape.fromPolygonsToSolid(buildRegularIcosahedron({}));

export const ofRadius = (radius = 1) => unitIcosahedron().scale(radius);
export const ofDiameter = (diameter = 1) =>
  unitIcosahedron().scale(diameter / 2);
export const Icosahedron = (...args) => ofRadius(...args);

Icosahedron.ofRadius = ofRadius;
Icosahedron.ofDiameter = ofDiameter;

export default Icosahedron;

Icosahedron.signature = "Icosahedron(radius:number = 1) -> Shape";
Icosahedron.ofRadius.signature =
  "Icosahedron.ofRadius(radius:number = 1) -> Shape";
Icosahedron.ofDiameter.signature =
  "Icosahedron.ofDiameter(diameter:number = 1) -> Shape";
