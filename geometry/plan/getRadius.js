import { distance } from '@jsxcad/math-vec3';
import { getSides } from './getSides.js';

const X = 0;
const Y = 1;
const Z = 2;

const toRadiusFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

export const getRadius = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'edge':
      return Math.min(
        ...plan._high.map((v) => Math.abs(v)),
        ...plan._low.map((v) => Math.abs(v))
      );
    case 'apothem':
      return toRadiusFromApothem(plan._apothem, getSides(plan));
    case 'diameter':
      return plan._diameter / 2;
    case 'radius':
      return plan._radius;
    case 'box':
      return Math.min(plan._length, plan._width) / 2;
    default: {
      let radius;
      if (plan.corner1 && plan.corner2) {
        const x = Math.abs(plan.corner1[X] - plan.corner2[X]) / 2;
        const y = Math.abs(plan.corner1[Y] - plan.corner2[Y]) / 2;
        const z = Math.abs(plan.corner1[Z] - plan.corner2[Z]) / 2;
        radius = [x, y, z];
      } else if (plan.corner1) {
        const x = Math.abs(plan.corner1[X]);
        const y = Math.abs(plan.corner1[Y]);
        const z = Math.abs(plan.corner1[Z]);
        radius = [x, y, z];
      } else if (plan.corner2) {
        const x = Math.abs(plan.corner2[X]);
        const y = Math.abs(plan.corner2[Y]);
        const z = Math.abs(plan.corner2[Z]);
        radius = [x, y, z];
      } else if (plan.radius !== undefined) radius = plan.radius;
      else if (plan.diameter !== undefined) {
        radius = plan.diameter.map((diameter) => diameter / 2);
      } else if (plan.apothem !== undefined) {
        radius = plan.apothem.map((apothem) =>
          toRadiusFromApothem(apothem, plan.sides)
        );
      } else throw Error(`Cannot produce radius from ${plan}`);
      let top;
      if (plan.from && plan.to) {
        top = distance(plan.from, plan.to);
      } else if (plan.top) {
        top = plan.top;
      } else {
        top = radius[Z];
      }
      let base;
      if (plan.from || plan.to) {
        base = 0;
      } else if (plan.base !== undefined) {
        base = plan.base;
      } else {
        base = -radius[Z];
      }
      return [radius[X], radius[Y], (top - base) / 2];
    }
  }
};
