import {
  buildRegularPrism,
  regularPolygonEdgeLengthToRadius,
  toRadiusFromApothem,
} from "@jsxcad/algorithm-shape";

import Shape from "@jsxcad/api-v1-shape";

/**
 *
 * # Cube (cuboid)
 *
 * Generates cuboids.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cube()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Cube(10, 20, 30)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofRadius(8)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofDiameter(16)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.ofApothem(8)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube.fromCorners([0, 0, 0], [10, 10, 10])
 * ```
 * :::
 *
 **/

// Geometry construction.

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

const unitCube = () =>
  Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([edgeScale, edgeScale, 1]);

// Cube Interfaces.

export const ofSize = (width = 1, length, height) =>
  unitCube().scale([
    width,
    length === undefined ? width : length,
    height === undefined ? width : height,
  ]);

export const ofRadius = (radius) =>
  Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([radius, radius, radius / edgeScale]);

export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem, 4));

export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1, corner2) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return unitCube()
    .scale([length, width, height])
    .move(...center);
};

export const Cube = (...args) => ofSize(...args);

Cube.ofSize = ofSize;
Cube.ofRadius = ofRadius;
Cube.ofApothem = ofApothem;
Cube.ofDiameter = ofDiameter;
Cube.fromCorners = fromCorners;

export default Cube;

Cube.signature = "Cube(size:number = 1) -> Shape";
Cube.ofSize.signature =
  "Cube.ofSize(width:number = 1, length:number = 1, height:number = 1) -> Shape";
Cube.ofRadius.signature = "Cube.ofRadius(radius:number = 1) -> Shape";
Cube.ofApothem.signature = "Cube.ofApothem(apothem:number = 1) -> Shape";
Cube.ofDiameter.signature = "Cube.ofDiameter(diameter:number = 1) -> Shape";
Cube.fromCorners.signature =
  "Cube.fromCorners(corner1:point, corner2:point) -> Shape";
