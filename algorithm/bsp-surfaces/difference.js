import {
  alignVertices,
  doesNotOverlap,
  flip,
  measureBoundingBox,
  toOutlinedSolid,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  clean,
  fromBoundingBoxes,
  inLeaf,
  outLeaf,
  removeExteriorPolygonsForDifference,
  removeInteriorPolygonsForDifference,
  fromSolid as toBspFromSolid
} from './bsp';

import { containsPoint } from './containsPoint';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { max } from '@jsxcad/math-vec3';
import partition from './partition';

const MIN = 0;

export const difference = (aSolid, ...bSolids) => {
  if (bSolids.length === 0) {
    return aSolid;
  }

  const normalize = createNormalize3();
  let a = toOutlinedSolid(alignVertices(aSolid, normalize), normalize);
  let bs = bSolids
      .map(b => toOutlinedSolid(alignVertices(b, normalize), normalize))
      .filter(b => !doesNotOverlap(a, b));

console.log(`QQ/a: ${JSON.stringify(a)}`);
console.log(`QQ/bs: ${JSON.stringify(bs)}`);

  while (bs.length > 0) {
    const b = bs.shift();

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const [aIn, aOut, aBsp] = partition(bbBsp, aBB, bBB, inLeaf, a, normalize);
    const [bIn, , bBsp] = partition(bbBsp, aBB, bBB, outLeaf, b, normalize);

    if (aIn.length === 0) {
      const bbMin = max(aBB[MIN], bBB[MIN]);
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = toBspFromSolid(a, normalize);
      if (containsPoint(aBsp, bbMin)) {
        // The space is fully enclosed; invert b.
        a = [...aOut, ...flip(bIn)];
      } else {
        // The space is fully vacated; nothing to be cut.
        continue;
      }
    } else if (bIn.length === 0) {
      const bbMin = max(aBB[MIN], bBB[MIN]);
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = toBspFromSolid(b, normalize);
      if (containsPoint(bBsp, bbMin)) {
        // The space is fully enclosed; only the out region remains.
        a = aOut;
      } else {
        // The space is fully vacated; nothing to cut with.
        continue;
      }
    } else {
      // Remove the parts of a that are inside b.
      const aTrimmed = removeInteriorPolygonsForDifference(bBsp, aIn, normalize);
      // Remove the parts of b that are outside a.
      const bTrimmed = removeExteriorPolygonsForDifference(aBsp, bIn, normalize);

      a = clean([...aOut, ...aTrimmed, ...flip(bTrimmed)]);
    }
  }
  return toSolidFromPolygons({}, a, normalize);
};
