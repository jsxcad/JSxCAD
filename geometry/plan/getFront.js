import { getRadius } from './getRadius.js';

export const getFront = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    default:
      return getRadius(plan);
  }
};
