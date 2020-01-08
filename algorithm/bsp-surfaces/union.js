import {
  alignVertices,
  createNormalize3,
  doesNotOverlap,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  removeInteriorPolygonsKeepingSkin,
  fromSolid as toBspFromSolid
} from './bsp';

import { merge } from './merge';

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const normalize = createNormalize3();
  while (solids.length > 1) {
    const a = alignVertices(solids.shift(), normalize);
    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a, normalize);

    const b = alignVertices(solids.shift(), normalize);
    const bPolygons = toPolygonsFromSolid({}, b);
    const bBsp = toBspFromSolid(b, normalize);

    const aTrimmed = removeInteriorPolygonsKeepingSkin(bBsp, aPolygons, normalize);
    const bTrimmed = removeInteriorPolygonsKeepingSkin(aBsp, bPolygons, normalize);

    solids.push(toSolidFromPolygons({}, merge(aTrimmed, bTrimmed, normalize)));
  }
  return alignVertices(solids[0], normalize);
};
