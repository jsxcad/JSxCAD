import {
  alignVertices,
  createNormalize3,
  doesNotOverlap,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  removeExteriorPolygonsKeepingSkin,
  fromSolid as toBspFromSolid
} from './bsp';

import { merge } from './merge';

// An asymmetric binary merge.
export const intersection = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const normalize = createNormalize3();
  while (solids.length > 1) {
    const a = alignVertices(solids.shift(), normalize);
    const b = alignVertices(solids.shift(), normalize);

    if (doesNotOverlap(a, b)) {
      return [];
    }

    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a);

    const bPolygons = toPolygonsFromSolid({}, b);
    const bBsp = toBspFromSolid(b);

    const aTrimmed = removeExteriorPolygonsKeepingSkin(bBsp, aPolygons);
    const bTrimmed = removeExteriorPolygonsKeepingSkin(aBsp, bPolygons);

    solids.push(toSolidFromPolygons({}, merge(aTrimmed, bTrimmed)));
  }
  return alignVertices(solids[0], normalize);
};
