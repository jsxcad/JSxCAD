const X = 0;
const Y = 1;
const Z = 2;

export const getCenter = (plan) => {
  let center;
  if (plan.corner1 && plan.corner2) {
    center = [
      (plan.corner1[X] + plan.corner2[X]) / 2,
      (plan.corner1[Y] + plan.corner2[Y]) / 2,
      (plan.corner1[Z] + plan.corner2[Z]) / 2,
    ];
  } else if (plan.corner1 || plan.corner2) {
    center = [0, 0, 0];
  } else {
    center = [0, 0, 0];
  }
  if (plan.top !== undefined || plan.base !== undefined) {
    center = [center[X], center[Y], 0];
  }
  return center;
};
