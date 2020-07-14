import Circle from './Circle.js';
import Prism from './Prism.js';
import { linear } from '@jsxcad/api-v1-math';
import { toRadiusFromApothem } from '@jsxcad/algorithm-shape';

export const ofRadius = (radius = 1, height = 1, { sides = 32 } = {}) => {
  const fn = linear(1, 0);
  return Prism.ofSlices((t) =>
    Circle(fn(t) * radius, { sides }).moveZ(t * height)
  );
};

export const ofDiameter = (diameter, ...args) =>
  ofRadius(diameter / 2, ...args);
export const ofApothem = (apothem, ...args) =>
  ofRadius(toRadiusFromApothem(apothem), ...args);

export const Cone = (...args) => ofRadius(...args);

Cone.ofRadius = ofRadius;
Cone.ofDiameter = ofDiameter;
Cone.ofApothem = ofApothem;

export default Cone;
