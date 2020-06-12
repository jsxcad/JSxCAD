import { Cube } from "@jsxcad/api-v1-shapes";

import Rod from "./Rod";

// TODO: Support designation decoding.

// 3/16 x 3 ft Round Stock, Zinc Plated
// 10-24 x 3 ft Threaded Rod, 316 Stainless Steel

export const FlatRod = (radius = 1, height = 1, flat = 0.25) =>
  Rod(radius, height)
    .cut(Cube(radius * 2, radius * 2, height).moveX(radius * 2 - flat))
    .fuse()
    .Item(`FlatRod ${flat} ${radius}x${height}`);

export default FlatRod;
