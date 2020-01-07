import {
  alignVertices,
  createNormalize3,
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

export const difference = (aSolid, ...bSolids) => {
  const normalize = createNormalize3();
  while (bSolids.length > 0) {
    const a = alignVertices(aSolid, normalize);
    const b = alignVertices(bSolids.shift(), normalize);

    if (doesNotOverlap(a, b)) {
      continue;
    }

    const aPolygons = toPolygonsFromSolid({}, a);
    const aBsp = toBspFromSolid(a);

    const bPolygons = toPolygonsFromSolid({}, flip(b));
    const bBsp = toBspFromSolid(b);

    const aTrimmed = removeInteriorPolygonsKeepingSkin2(bBsp, aPolygons);
    const bTrimmed = removeExteriorPolygons2(aBsp, bPolygons);

    aSolid = toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed]);
  }
  return alignVertices(aSolid, normalize);
};
