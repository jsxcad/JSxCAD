import {
  buildFromFunction,
  buildFromSlices,
  buildRegularPrism,
  toRadiusFromApothem,
} from '@jsxcad/algorithm-shape';

import Shape from '@jsxcad/api-v1-shape';
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

export const ofRadius = (radius = 1, height = 1, { sides = 32 } = {}) =>
  buildPrism(radius, height, sides);
export const ofApothem = (apothem = 1, height = 1, { sides = 32 } = {}) =>
  ofRadius(toRadiusFromApothem(apothem, sides), height, { sides });
export const ofDiameter = (diameter = 1, ...args) =>
  ofRadius(diameter / 2, ...args);

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

export const ofSlices = (op, { slices = 2, cap = true } = {}) =>
  Shape.fromGeometry(
    buildFromSlices((slice) => toPathFromShape(op(slice)), slices, cap)
  );

export const Cylinder = (...args) => ofRadius(...args);

Cylinder.ofRadius = ofRadius;
Cylinder.ofApothem = ofApothem;
Cylinder.ofDiameter = ofDiameter;
Cylinder.ofFunction = ofFunction;
Cylinder.ofSlices = ofSlices;

export default Cylinder;

Cylinder.signature =
  'Cylinder(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofRadius.signature =
  'Cylinder.ofRadius(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofDiameter.signature =
  'Cylinder.ofDiameter(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofApothem.signature =
  'Cylinder.ofApothem(radius:number = 1, height:number = 1, { sides:number = 32 }) -> Shape';
Cylinder.ofSlices.signature =
  'Cylinder.ofSlices(op:function, { slices:number = 2, cap:boolean = true }) -> Shape';
Cylinder.ofFunction.signature =
  'Cylinder.ofFunction(op:function, { resolution:number, cap:boolean = true, context:Object }) -> Shape';
