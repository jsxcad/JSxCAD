import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { buildRingSphere, toRadiusFromApothem } from '@jsxcad/algorithm-shape';

import { taggedSolid } from '@jsxcad/geometry-tagged';

const unitSphere = (resolution = 16) => {
  const shape = Shape.fromGeometry(
    taggedSolid({}, buildRingSphere(resolution))
  );
  return shape.toGraph();
};

export const ofRadius = (radius = 1, { resolution = 16 } = {}) =>
  unitSphere(resolution).scale(radius);
export const ofApothem = (apothem = 1, { resolution = 16 } = {}) =>
  ofRadius(toRadiusFromApothem(apothem, (2 + resolution) * 2), { resolution });
export const ofDiameter = (diameter = 1, { resolution = 16 } = {}) =>
  ofRadius(diameter / 2, { resolution });

export const ofPlan = (plan, { resolution = 16 } = {}) => {
  switch (plan.type) {
    default: {
      const width = Math.abs(plan.length);
      const length = Math.abs(plan.width);
      const height = Math.abs(plan.height);
      return unitSphere(1, { resolution })
        .scale(width / 2, length / 2, height / 2)
        .move(...plan.center);
    }
  }
};

export const Ball = (...args) => {
  if (typeof args[0] === 'object') {
    return ofPlan(...args);
  } else {
    return ofRadius(...args);
  }
};

export const BallOfApothem = ofApothem;
export const BallOfRadius = ofRadius;
export const BallOfDiameter = ofDiameter;

Shape.prototype.Ball = shapeMethod(Ball);
Shape.prototype.BallOfApothem = shapeMethod(BallOfApothem);
Shape.prototype.BallOfDiameter = shapeMethod(BallOfDiameter);
Shape.prototype.BallOfRadius = shapeMethod(BallOfRadius);

export default Ball;
