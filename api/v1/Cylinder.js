import { assertEmpty, assertFunction, assertNumber } from './assert';
import { buildFromSlices, buildRegularPrism } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';
import { distance } from '@jsxcad/math-vec3';

const buildPrism = (radius = 1, height = 1, sides = 32) =>
  Shape.fromGeometry(buildRegularPrism(sides)).scale([radius, radius, height]);

/**
 *
 * # Cylinder
 *
 * Generates cylinders.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cylinder()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder(10, 2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ radius: 2,
 *            height: 10,
 *            sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ apothem: 2,
 *            height: 10,
 *            sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ diameter: 6,
 *            height: 8,
 *            sides: 16 })
 * ```
 * :::
 *
 **/

export const fromValue = (radius, height = 1, sides = 32) => buildPrism(radius, height, sides);

export const fromRadius = (radius, height = 1, sides = 32) => buildPrism(radius, height, sides);

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);

export const fromApothem = (apothem, height = 1, sides = 32) => buildPrism(toRadiusFromApothem(apothem, sides), height, sides);

export const fromDiameter = (diameter, height = 1, sides = 32) => buildPrism(diameter / 2, height, sides);

export const betweenRadius = (from, to, radius, sides = 32) =>
  fromRadius(radius, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

export const betweenDiameter = (from, to, diameter, sides = 32) =>
  fromDiameter(diameter, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

export const fromFunction = (buildPath, slices) => {
  const build = (slice) => buildPath(slice).toPoints().points;
  return Shape.fromPolygonsToSolid(buildFromSlices({ buildPath: build, slices }));
};

export const Cylinder = dispatch(
  'Cylinder',
  // cylinder()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  (radius, height = 1, sides = 32) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromValue(radius, height, sides);
  },
  ({ radius, height = 1, sides = 32 }) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromRadius(radius, height, sides);
  },
  ({ apothem, height = 1, sides = 32 }) => {
    assertNumber(apothem);
    assertNumber(height);
    assertNumber(sides);
    return () => fromApothem(apothem, height, sides);
  },
  ({ diameter, height = 1, sides = 32 }) => {
    assertNumber(diameter);
    assertNumber(height);
    assertNumber(sides);
    return () => fromDiameter(diameter, height, sides);
  },
  ({ slices }, buildPath) => {
    assertNumber(slices);
    assertFunction(buildPath);
    return () => fromFunction(buildPath, slices);
  });

export const between = dispatch(
  'Cylinder.between',
  ({ radius, sides = 32 }, from, to) => {
    assertNumber(radius);
    return () => betweenRadius(from, to, radius, sides);
  },
  ({ diameter, sides = 32 }, from, to) => {
    assertNumber(diameter);
    return () => betweenDiameter(from, to, diameter, sides);
  });

Cylinder.fromValue = fromValue;
Cylinder.fromRadius = fromRadius;
Cylinder.fromDiameter = fromDiameter;
Cylinder.fromFunction = fromFunction;
Cylinder.between = between;
Cylinder.betweenRadius = betweenRadius;
Cylinder.betweenDiameter = betweenDiameter;

export default Cylinder;
