export const getCenter = (plan) => {
  if (typeof plan === 'number') {
    return [0, 0, 0];
  }
  return plan.center || [0, 0, 0];
};
