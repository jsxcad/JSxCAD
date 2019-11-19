import { buildFromFunction, buildFromSlices, buildRegularPrism, toRadiusFromApothem } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { getAnySurfaces } from '@jsxcad/geometry-tagged';

const buildPrism = (radius = 1, height = 1, sides = 32) =>
  Shape.fromGeometry(buildRegularPrism(sides)).scale([radius, radius, height]);

/**
 *
 * # Prism
 *
 * Generates prisms.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Prism()
 * ```
 * :::
 *
 **/

export const ofRadius = (radius = 1, height = 1, { sides = 3 } = {}) => buildPrism(radius, height, sides);

export const ofApothem = (apothem = 1, { sides = 3 }) => ofRadius(toRadiusFromApothem(apothem, sides), { sides });
export const ofDiameter = (diameter = 1, ...args) => ofRadius(diameter / 2, ...args);

const toPathFromSurface = (shape) => {
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    for (const path of anySurface) {
      return path;
    }
  }
  return [];
};

export const ofFunction = (op, { resolution, cap = true, context } = {}) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

export const ofSlices = (op, { slices = 2, cap = true } = {}) =>
  Shape.fromGeometry(buildFromSlices(t => toPathFromSurface(op(t)), slices, cap));

export const Prism = (...args) => ofRadius(...args);

Prism.ofRadius = ofRadius;
Prism.ofDiameter = ofDiameter;
Prism.ofFunction = ofFunction;
Prism.ofSlices = ofSlices;

export default Prism;
