import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { buildRingSphere, toRadiusFromApothem } from '@jsxcad/algorithm-shape';

import { taggedSolid } from '@jsxcad/geometry-tagged';

const unitSphere = (resolution = 16) => {
  const shape = Shape.fromGeometry(
    taggedSolid({}, buildRingSphere(resolution))
  );
  return shape;
};

export const ofRadius = (radius = 1, { resolution = 16 } = {}) =>
  unitSphere(resolution).scale(radius);
export const ofApothem = (apothem = 1, { resolution = 16 } = {}) =>
  ofRadius(toRadiusFromApothem(apothem, (2 + resolution) * 2), { resolution });
export const ofDiameter = (diameter = 1, { resolution = 16 } = {}) =>
  ofRadius(diameter / 2, { resolution });

export const Ball = ofRadius;
export const BallOfApothem = ofApothem;
export const BallOfRadius = ofRadius;
export const BallOfDiameter = ofDiameter;

Shape.prototype.Ball = shapeMethod(Ball);
Shape.prototype.BallOfApothem = shapeMethod(BallOfApothem);
Shape.prototype.BallOfDiameter = shapeMethod(BallOfDiameter);
Shape.prototype.BallOfRadius = shapeMethod(BallOfRadius);

export default Ball;
