import {
  alignVertices,
  doesNotOverlap,
  flip,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  removeExteriorPolygons2,
  removeInteriorPolygonsKeepingSkin2,
  fromSolid as toBspFromSolid
} from './bsp';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';

import { merge } from './merge';

export const difference = (aSolid, ...bSolids) => {
  const normalize = createNormalize3();
  while (bSolids.length > 0) {
    const a = alignVertices(aSolid, normalize);
    const b = alignVertices(bSolids.shift(), normalize);

    if (doesNotOverlap(a, b)) {
      continue;
    }

    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a, normalize);

    const bPolygons = toPolygonsFromSolid({}, flip(b));
    const bBsp = toBspFromSolid(b, normalize);

    const aTrimmed = removeInteriorPolygonsKeepingSkin2(bBsp, aPolygons, normalize);
    const bTrimmed = removeExteriorPolygons2(aBsp, bPolygons, normalize);

    aSolid = toSolidFromPolygons({}, merge(aTrimmed, bTrimmed, normalize));
  }
  return alignVertices(aSolid, normalize);
};
