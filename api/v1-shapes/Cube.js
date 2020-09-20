import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  buildRegularPrism,
  regularPolygonEdgeLengthToRadius,
  toRadiusFromApothem,
} from '@jsxcad/algorithm-shape';

import { taggedSolid } from '@jsxcad/geometry-tagged';

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

const unitCube = () =>
  Shape.fromGeometry(taggedSolid({}, buildRegularPrism(4)))
    .rotateZ(45)
    .scale(edgeScale, edgeScale, 1);

// Cube Interfaces.

export const ofSize = (width = 1, length, height) =>
  unitCube().scale(width, length, height);

export const ofRadius = (radius) =>
  Shape.fromGeometry(taggedSolid({}, buildRegularPrism(4)))
    .rotateZ(45)
    .scale(radius, radius, radius / edgeScale);

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
    .scale(length, width, height)
    .move(...center);
};

export const Cube = (...args) => ofSize(...args);

Cube.ofSize = ofSize;
Cube.ofRadius = ofRadius;
Cube.ofApothem = ofApothem;
Cube.ofDiameter = ofDiameter;
Cube.fromCorners = fromCorners;

export const Box = Cube;
export default Cube;

Shape.prototype.Box = shapeMethod(Box);
Shape.prototype.Cube = shapeMethod(Cube);
