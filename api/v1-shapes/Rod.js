import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Polygon } from './Polygon.js';
import { toRadiusFromApothem } from '@jsxcad/algorithm-shape';

export const ofRadius = (radius = 1, height = 1, { sides = 32 } = {}) =>
  Polygon(radius, { sides }).pull(height / 2, height / -2);
export const ofApothem = (apothem = 1, height = 1, { sides = 32 } = {}) =>
  ofRadius(toRadiusFromApothem(apothem, sides), height, { sides });
export const ofDiameter = (diameter = 1, ...args) =>
  ofRadius(diameter / 2, ...args);

export const ofPlan = (plan, { sides = 32 } = {}) => {
  switch (plan.type) {
    default: {
      const width = Math.abs(plan.length);
      const length = Math.abs(plan.width);
      const height = Math.abs(plan.height);
      return ofRadius(1, 1, { sides })
        .scale(width / 2, length / 2, height)
        .move(...plan.center);
    }
  }
};

export const Rod = (...args) => {
  if (typeof args[0] === 'object') {
    return ofPlan(...args);
  } else {
    return ofRadius(...args);
  }
};

Shape.prototype.Rod = shapeMethod(Rod);

export default Rod;
