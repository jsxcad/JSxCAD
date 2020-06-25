import { Cylinder } from '@jsxcad/api-v1-shapes';

// TODO: Support designation decoding.

// 3/16 x 3 ft Round Stock, Zinc Plated
// 10-24 x 3 ft Threaded Rod, 316 Stainless Steel

export const Rod = (radius = 1, height = 1) =>
  Cylinder(radius, height)
    .op((s) => s.with(s.top(), s.bottom()))
    .Item(`Rod ${radius}x${height}`);

export default Rod;
