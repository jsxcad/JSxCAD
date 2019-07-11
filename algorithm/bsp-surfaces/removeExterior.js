import { removeExteriorPolygons } from './removeExteriorPolygons';

// Destructively remove all parts of surfaces from a that are outside b.
export const removeExterior = (a, b, alsoRemoveCoplanarBack = false) => {
  if (a === null) {
    return null;
  } else {
    const clipped = {
      back: removeExterior(a.back, b, alsoRemoveCoplanarBack),
      front: removeExterior(a.front, b, alsoRemoveCoplanarBack),
      same: removeExteriorPolygons(b, a.same, alsoRemoveCoplanarBack)
    };
    return clipped;
  }
};
