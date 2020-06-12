import { difference } from "./difference";
import { intersection } from "./intersection";
import { intersectionOfPathsBySurfaces } from "./intersectionOfPathsBySurfaces";
import { makeConvex } from "./makeConvex";
import { union } from "./union";

const outline = (surface) => union(surface, surface);

export {
  difference,
  intersection,
  intersectionOfPathsBySurfaces,
  makeConvex,
  outline,
  union,
};
