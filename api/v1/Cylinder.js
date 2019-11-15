import { buildFromFunction, buildFromSlices, buildRegularPrism } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { distance } from '@jsxcad/math-vec3';
import { getPaths } from '@jsxcad/geometry-tagged';

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

export const ofRadius = (radius, height = 1, sides = 32) => buildPrism(radius, height, sides);

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);

export const ofApothem = (apothem, height = 1, sides = 32) => buildPrism(toRadiusFromApothem(apothem, sides),
                                                                         height,
                                                                         sides);

export const ofDiameter = (diameter, height = 1, sides = 32) => buildPrism(diameter / 2, height, sides);

export const betweenRadius = (from, to, radius, sides = 32) =>
  ofRadius(radius, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

export const betweenDiameter = (from, to, diameter, sides = 32) =>
  ofDiameter(diameter, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

const toPathFromShape = (shape) => {
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    for (const path of paths) {
      return path;
    }
  }
  return [];
};

export const ofFunction = (op, resolution, cap = true, context) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

export const ofSlices = (op, slices, cap = true) =>
  Shape.fromGeometry(buildFromSlices(slice => toPathFromShape(op(slice)), slices, cap));

export const Cylinder = (...args) => ofRadius(...args);

Cylinder.ofRadius = ofRadius;
Cylinder.ofApothem = ofApothem;
Cylinder.ofDiameter = ofDiameter;
Cylinder.ofFunction = ofFunction;
Cylinder.ofSlices = ofSlices;
Cylinder.betweenRadius = betweenRadius;
Cylinder.betweenDiameter = betweenDiameter;

export default Cylinder;
