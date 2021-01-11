import { getRadius } from './getRadius.js';

const Z = 2;

export const getBottom = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'edge':
      return plan._at[Z] + plan._low[Z];
    default: {
      if (plan.from || plan.to) {
        return 0;
      } else if (plan.base !== undefined) {
        return plan.base;
      }
      return -getRadius(plan)[Z];
    }
  }
};

export const getBase = getBottom;
