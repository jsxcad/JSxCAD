import { radius } from '@jsxcad/geometry-plan';

export const orRadius = (value) => {
  if (typeof value === 'number') {
    return radius(value);
  } else {
    return value;
  }
};
