import {
  alignVertices,
  createNormalize3,
  doesNotOverlap,
  measureBoundingBox,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  boundPolygons,
  fromBoundingBoxes,
  inLeaf,
  outLeaf,
  removeExteriorPolygons2,
  removeInteriorPolygonsKeepingSkin2,
  fromPolygons as toBspFromPolygons,
  fromSolid as toBspFromSolid
} from './bsp';

import { containsPoint } from './containsPoint';
import { flip } from '@jsxcad/geometry-polygons';
import { max } from '@jsxcad/math-vec3';

export const difference = (aSolid, ...bSolids) => {
  const normalize = createNormalize3();
  while (bSolids.length > 0) {
    const a = alignVertices(aSolid, normalize);
    const b = alignVertices(bSolids.shift(), normalize);

    if (doesNotOverlap(a, b)) {
      continue;
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = toPolygonsFromSolid({}, a);
    const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(aIn, normalize));

    const bPolygons = toPolygonsFromSolid({}, b);
    const [bIn] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = toBspFromSolid(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; invert b.
        aSolid = toSolidFromPolygons({}, [...aOut, ...flip(bIn)]);
      } else {
        // The space is fully vacated; nothing to be cut.
        continue;
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = toBspFromSolid(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; only the out region remains.
        aSolid = toSolidFromPolygons({}, aOut);
      } else {
        // The space is fully vacated; nothing to cut with.
        continue;
      }
    } else {
      const aTrimmed = removeInteriorPolygonsKeepingSkin2(bBsp, aIn, normalize);
      const bTrimmed = removeExteriorPolygons2(aBsp, flip(bIn), normalize);

      aSolid = toSolidFromPolygons({}, [...aOut, ...aTrimmed, ...bTrimmed], normalize);
    }
  }
  return alignVertices(aSolid, normalize);
};
