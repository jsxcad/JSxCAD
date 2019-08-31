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

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

// Note: We can't call this while bootstrapping, but we could memoize the result afterward.
const unitCube = () => Shape.fromSolid(buildRegularPrism({ edges: 4 }))
    .rotateZ(45)
    .scale([edgeScale, edgeScale, 1]);

// Cube Interfaces.

export const fromValue = (value) => unitCube().scale(value);

export const fromValues = (width, breadth, height) => unitCube().scale([width, breadth, height]);

export const fromRadius = (radius) => Shape.fromSolid(buildRegularPrism({ edges: 4 })).rotateZ(45).scale([radius, radius, radius / edgeScale]);

export const fromDiameter = (diameter) => fromRadius(diameter / 2);

export const fromCorners = (corner1, corner2) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return unitCube().scale([length, width, height]).translate(center);
};

export const Cube = dispatch(
  'Cube',
  // cube()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // cube(2)
  (value, ...rest) => {
    assertNumber(value);
    assertEmpty(rest);
    return () => fromValue(value);
  },
  // cube(2, 4, 6)
  (width, breadth, height, ...rest) => {
    assertNumber(width);
    assertNumber(breadth);
    assertNumber(height);
    assertEmpty(rest);
    return () => fromValues(width, breadth, height);
  },
  // cube({ radius: 2 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius(radius);
  },
  // cube({ diameter: 2 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter(diameter);
  },
  // cube({ corner1: [2, 2, 2], corner2: [1, 1, 1] })
  ({ corner1, corner2 }) => {
    assertNumberTriple(corner1);
    assertNumberTriple(corner2);
    return () => fromCorners(corner1, corner2);
  });

Cube.fromValue = fromValue;
Cube.fromValues = fromValues;
Cube.fromRadius = fromRadius;
Cube.fromDiameter = fromDiameter;
Cube.fromCorners = fromCorners;

export default Cube;
