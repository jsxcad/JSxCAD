import { transform as transformPoint } from '@jsxcad/math-vec3';

export const transform = (matrix, plan) => {
  if (plan.at) {
    const { at } = plan;
    const transformedAt = transformPoint(matrix, at);
    if (at.length > 3) {
      const forward = at.slice(3, 6);
      const transformedForward = transformPoint(matrix, forward);
      transformedAt.push(...transformedForward);
    }
    if (at.length > 6) {
      const right = at.slice(6, 9);
      const transformedRight = transformPoint(matrix, right);
      transformedAt.push(...transformedRight);
    }
    return { ...plan, at: transformedAt };
  } else {
    return plan;
  }
};
