import { assertEmpty, assertNumber, assertNumberTriple } from './assert';
import { buildRegularPrism, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

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
 * Cube({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube({ diameter: 16 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube({ corner1: [0, 0, 0],
 *        corner2: [10, 10, 10] })
 * ```
 * :::
 *
 **/

// Geometry construction.

const toRadiusFromApothem = (apothem) => apothem / Math.cos(Math.PI / 4);
const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

const unitCube = () => Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([edgeScale, edgeScale, 1]);

// Cube Interfaces.

export const ofEdge = (value) => unitCube().scale(value);

export const ofEdges = (width, length, height) => unitCube().scale([width, length, height]);

export const ofRadius = (radius) => Shape.fromGeometry(buildRegularPrism(4))
    .rotateZ(45)
    .scale([radius, radius, radius / edgeScale]);

export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem));

export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1, corner2) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return unitCube().scale([length, width, height]).move(...center);
};

export const Cube = dispatch(
  'Cube',
  // cube()
  (...rest) => {
    assertEmpty(rest);
    return () => ofEdge(1);
  },
  // cube(2)
  (value, ...rest) => {
    assertNumber(value);
    assertEmpty(rest);
    return () => ofEdge(value);
  },
  // cube(2, 4, 6)
  (width, length, height, ...rest) => {
    assertNumber(width);
    assertNumber(length);
    assertNumber(height);
    assertEmpty(rest);
    return () => ofEdges(width, length, height);
  },
  // cube({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => ofRadius(radius);
  },
  // cube({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => ofDiameter(diameter);
  },
  // cube({ apothem: 2 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => ofApothem(apothem);
  },
  // cube({ corner1: [2, 2, 2], corner2: [1, 1, 1] })
  ({ corner1, corner2 }) => {
    assertNumberTriple(corner1);
    assertNumberTriple(corner2);
    return () => fromCorners(corner1, corner2);
  });

Cube.ofEdge = ofEdge;
Cube.ofEdges = ofEdges;
Cube.ofRadius = ofRadius;
Cube.ofApothem = ofApothem;
Cube.ofDiameter = ofDiameter;
Cube.fromCorners = fromCorners;

export default Cube;
