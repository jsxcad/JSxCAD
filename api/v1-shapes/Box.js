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
    .toGraph()
    .rotateZ(45)
    .scale(edgeScale, edgeScale, 1);

// Box Interfaces.

export const ofPlan = (plan) => {
  switch (plan.type) {
    default: {
      const width = Math.abs(plan.length);
      const length = Math.abs(plan.width);
      const height = Math.abs(plan.height);
      return unitCube()
        .scale(width, length, height)
        .move(...plan.center);
    }
  }
};

export const ofSize = (width = 1, length = width, height = length) =>
  unitCube().scale(width, length, height);

export const ofEdge = (length = 1) => ofSize(1);

export const ofRadius = (radius) =>
  Shape.fromGeometry(taggedSolid({}, buildRegularPrism(4)))
    .rotateZ(45)
    .scale(radius, radius, radius / edgeScale);

export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem, 4));

export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1 = [1, 1, 1], corner2 = [0, 0, 0]) => {
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

export const Box = (...args) => {
  if (typeof args[0] === 'object') {
    return ofPlan(...args);
  } else {
    return ofSize(...args);
  }
};

export const BoxOfApothem = ofApothem;
export const BoxOfCorners = fromCorners;
export const BoxOfDiameter = ofDiameter;
export const BoxOfEdge = ofEdge;
export const BoxOfRadius = ofRadius;
export const BoxOfSize = ofSize;

Shape.prototype.Box = shapeMethod(Box);
Shape.prototype.BoxOfApothem = shapeMethod(BoxOfApothem);
Shape.prototype.BoxOfCorners = shapeMethod(BoxOfCorners);
Shape.prototype.BoxOfDiameter = shapeMethod(BoxOfDiameter);
Shape.prototype.BoxOfEdge = shapeMethod(BoxOfEdge);
Shape.prototype.BoxOfRadius = shapeMethod(BoxOfRadius);
Shape.prototype.BoxOfSize = shapeMethod(BoxOfSize);

export default Box;
