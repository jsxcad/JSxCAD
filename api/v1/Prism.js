import { buildFromFunction, buildFromSlices, buildRegularPrism } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { distance } from '@jsxcad/math-vec3';
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

export const ofValue = (radius, height = 1, sides = 5) => buildPrism(radius, height, sides);

export const ofRadius = (radius, height = 1, sides = 5) => buildPrism(radius, height, sides);

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);

export const ofApothem = (apothem, height = 1, sides = 5) => buildPrism(toRadiusFromApothem(apothem, sides), height, sides);

export const ofDiameter = (diameter, height = 1, sides = 5) => buildPrism(diameter / 2, height, sides);

export const betweenRadius = (from, to, radius, sides = 5) =>
  ofRadius(radius, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

export const betweenDiameter = (from, to, diameter, sides = 5) =>
  ofDiameter(diameter, distance(from, to), sides)
      .above()
      .orient({ from, at: to });

const toPathFromSurface = (shape) => {
  for (const { surface, z0Surface } of getAnySurfaces(shape.toKeptGeometry())) {
    const anySurface = surface || z0Surface;
    for (const path of anySurface) {
      return path;
    }
  }
  return [];
};

export const ofFunction = (op, resolution, cap = true, context) =>
  Shape.fromGeometry(buildFromFunction(op, resolution, cap, context));

export const ofSlices = (op, slices, cap = true) =>
  Shape.fromGeometry(buildFromSlices(t => toPathFromSurface(op(t)), slices, cap));

export const Prism = (...args) => ofRadius(...args);

Prism.ofRadius = ofRadius;
Prism.ofDiameter = ofDiameter;
Prism.ofFunction = ofFunction;
Prism.ofSlices = ofSlices;
Prism.betweenRadius = betweenRadius;
Prism.betweenDiameter = betweenDiameter;

export default Prism;
