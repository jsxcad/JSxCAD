import {
  alignVertices,
  fromPolygons as fromPolygonsToSolid,
  toPolygons as toPolygonsFromSolid,
} from '@jsxcad/geometry-solid';

import {
  clean,
  fromBoundingBoxes,
  inLeaf,
  outLeaf,
  removeExteriorPolygonForDifference,
  removeInteriorPolygonForDifference,
  fromPolygons as toBspFromPolygons,
} from './bsp.js';

import {
  doesNotOverlap,
  flip,
  measureBoundingBox,
} from '@jsxcad/geometry-polygons';

import { containsPoint } from './containsPoint.js';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { max } from '@jsxcad/math-vec3';
import partition from './partition.js';

const MIN = 0;

export const difference = (aSolid, ...bSolids) => {
  if (bSolids.length === 0) {
    return aSolid;
  }

  const normalize = createNormalize3();
  let a = toPolygonsFromSolid(alignVertices(aSolid, normalize));
  if (a.length === 0) {
    return [];
  }
  let bs = bSolids
    .map((b) => toPolygonsFromSolid(alignVertices(b, normalize)))
    .filter((b) => b.length > 0 && !doesNotOverlap(a, b));

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
      const aTrimmed = [];
      const aEmit = (polygon) => aTrimmed.push(polygon);
      for (const aPolygon of aIn) {
        const kept = removeInteriorPolygonForDifference(
          bBsp,
          aPolygon,
          normalize,
          aEmit
        );
        if (kept) {
          aEmit(kept);
        }
      }
      // Remove the parts of b that are outside a.
      const bTrimmed = [];
      const bEmit = (polygon) => bTrimmed.push(polygon);
      for (const bPolygon of bIn) {
        const kept = removeExteriorPolygonForDifference(
          aBsp,
          bPolygon,
          normalize,
          bEmit
        );
        if (kept) {
          bEmit(kept);
        }
      }
      a = clean([...aOut, ...aTrimmed, ...flip(bTrimmed)]);
    }
  }
  return fromPolygonsToSolid(a, normalize);
};
