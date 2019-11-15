import { buildFromFunction, buildFromSlices, buildRegularPrism } from '@jsxcad/algorithm-shape';

import Shape from './Shape';
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
 * Cylinder(10, 5)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofRadius(6, 10, { sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofApothem(6, 10, { sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder.ofDiameter(6, 8, { sides: 16 })
 * ```
 * :::
 *
 **/

export const ofRadius = (radius, height = 1, { sides = 32 } = {}) => buildPrism(radius, height, sides);

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);

export const ofApothem = (apothem, height = 1, { sides = 32 } = {}) => buildPrism(toRadiusFromApothem(apothem, sides),
                                                                                  height, sides);

export const ofDiameter = (diameter, height = 1, { sides = 32 } = {}) => buildPrism(diameter / 2, height, sides);

const toPathFromShape = (shape) => {
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    for (const path of paths) {
      return path;
    }
  }
  return [];
};

export const ofFunction = (op, { resolution, cap = true, context } = {}) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

export const ofSlices = (op, { slices, cap = true } = {}) =>
  Shape.fromGeometry(buildFromSlices(slice => toPathFromShape(op(slice)), slices, cap));

export const Cylinder = (...args) => ofRadius(...args);

Cylinder.ofRadius = ofRadius;
Cylinder.ofApothem = ofApothem;
Cylinder.ofDiameter = ofDiameter;
Cylinder.ofFunction = ofFunction;
Cylinder.ofSlices = ofSlices;

export default Cylinder;
