import { difference } from "./difference";
import { intersection } from "./intersection";
import { intersectionOfPathsBySurfaces } from "./intersectionOfPathsBySurfaces";
import { makeConvex } from "./makeConvex";
import { reorient } from "./reorient";
import { union } from "./union";

const outline = reorient;

export {
  outline,
  difference,
  intersection,
  intersectionOfPathsBySurfaces,
  makeConvex,
  reorient,
  union,
};
