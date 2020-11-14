import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Circle from './Circle.js';
import Hull from './Hull.js';
import { toRadiusFromApothem } from '@jsxcad/algorithm-shape';

export const ofRadius = (radius = 1, height = 1, { sides = 32 } = {}) =>
  Hull(Circle(0.1).moveZ(height), Circle(radius));

export const ofDiameter = (diameter, ...args) =>
  ofRadius(diameter / 2, ...args);
export const ofApothem = (apothem, ...args) =>
  ofRadius(toRadiusFromApothem(apothem), ...args);

export const Cone = (...args) => ofRadius(...args);

Cone.ofRadius = ofRadius;
Cone.ofDiameter = ofDiameter;
Cone.ofApothem = ofApothem;

export default Cone;

Shape.prototype.Cone = shapeMethod(Cone);
