import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  regularPolygonEdgeLengthToRadius,
  toRadiusFromApothem,
} from '@jsxcad/algorithm-shape';

import { Square } from './Square.js';

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

// Box Interfaces.

export const ofPlan = (plan) => {
  switch (plan.type) {
    default: {
      const width = Math.abs(plan.length);
      const length = Math.abs(plan.width);
      const height = Math.abs(plan.height);
      return Square(width, length)
        .pull(height / 2, height / -2)
        .move(...plan.center);
    }
  }
};

export const ofSize = (width = 1, length = width, height = length) =>
  Square(width, length).pull(height / 2, height / -2);

export const ofEdge = (length = 1) => ofSize(1);

export const ofRadius = (radius) => ofEdge(radius / edgeScale);

export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem, 4));

export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1 = [1, 1, 1], corner2 = [0, 0, 0]) => {
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return ofSize(length, width, height).move(...center);
};

export const Box = (...args) => {
  if (typeof args[0] === 'object') {
    return ofPlan(...args);
  } else if (args.length < 3) {
    return Square(...args);
  } else {
    return ofSize(...args);
  }
};

Shape.prototype.Box = shapeMethod(Box);

export default Box;
