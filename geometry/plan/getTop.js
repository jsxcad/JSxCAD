import { distance } from '@jsxcad/math-vec3';
import { getRadius } from './getRadius.js';

const Z = 2;

export const getTop = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'edge':
      return plan._at[Z] + plan._high[Z];
    default: {
      if (plan.from && plan.to) {
        return distance(plan.from, plan.to);
      }
      if (plan.top !== undefined) {
        return plan.top;
      }
      return getRadius(plan)[Z];
    }
  }
};
