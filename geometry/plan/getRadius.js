import { getSides } from './getSides.js';

const toRadiusFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

export const getRadius = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'apothem':
      return toRadiusFromApothem(plan.apothem, getSides(plan));
    case 'diameter':
      return plan.diameter / 2;
    case 'radius':
      return plan.radius;
    case 'box':
      return Math.min(plan.length, plan.width) / 2;
  }
};
