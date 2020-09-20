import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  buildFromFunction,
  buildFromSlices,
  buildRegularPrism,
  toRadiusFromApothem,
} from '@jsxcad/algorithm-shape';
import { getPaths, taggedSolid } from '@jsxcad/geometry-tagged';

const buildPrism = (radius = 1, height = 1, sides = 32) =>
  Shape.fromGeometry(taggedSolid({}, buildRegularPrism(sides))).scale(
    radius,
    radius,
    height
  );

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
  Shape.fromGeometry(
    taggedSolid({}, buildFromFunction(op, resolution, cap, context))
  );

export const ofSlices = (op, { slices = 2, cap = true } = {}) =>
  Shape.fromGeometry(
    taggedSolid(
      {},
      buildFromSlices((slice) => toPathFromShape(op(slice)), slices, cap)
    )
  );

export const Cylinder = (...args) => ofRadius(...args);

Cylinder.ofRadius = ofRadius;
Cylinder.ofApothem = ofApothem;
Cylinder.ofDiameter = ofDiameter;
Cylinder.ofFunction = ofFunction;
Cylinder.ofSlices = ofSlices;

export default Cylinder;

export const Rod = Cylinder;

Shape.prototype.Cylinder = shapeMethod(Cylinder);
Shape.prototype.Rod = shapeMethod(Rod);
