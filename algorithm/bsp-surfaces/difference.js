import {
  alignVertices,
  outline,
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
  fromPolygons as toBspFromPolygons
} from './bsp';

import {
  doesNotOverlap,
  flip,
  measureBoundingBox
} from '@jsxcad/geometry-polygons';

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
  let a = outline(alignVertices(aSolid, normalize), normalize);
  let bs = bSolids
      .map(b => outline(alignVertices(b, normalize), normalize))
      .filter(b => !doesNotOverlap(a, b));

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
      const aBsp = toBspFromPolygons(a, normalize);
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
      const bBsp = toBspFromPolygons(b, normalize);
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
