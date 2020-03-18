import {
  alignVertices,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  clean,
  fromBoundingBoxes,
  inLeaf,
  outLeaf,
  removeInteriorPolygonsForUnionDroppingOverlap,
  removeInteriorPolygonsForUnionKeepingOverlap,
  fromPolygons as toBspFromPolygons
} from './bsp';

import {
  doesNotOverlap,
  measureBoundingBox
} from '@jsxcad/geometry-polygons';

import { containsPoint } from './containsPoint';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { max } from '@jsxcad/math-vec3';
import partition from './partition';

const MIN = 0;

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  if (solids.length === 1) {
    return solids[0];
  }
  const normalize = createNormalize3();
  const s = solids.map(solid => toPolygonsFromSolid(alignVertices(solid, normalize)));
  while (s.length >= 2) {
    const a = s.shift();
    const b = s.shift();

    if (doesNotOverlap(a, b)) {
      s.push([...a, ...b]);
      continue;
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const [aIn, aOut, aBsp] = partition(bbBsp, aBB, bBB, inLeaf, a, normalize);
    const [bIn, bOut, bBsp] = partition(bbBsp, aBB, bBB, inLeaf, b, normalize);

    if (aIn.length === 0) {
      const bbMin = max(aBB[MIN], bBB[MIN]);
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = toBspFromPolygons(a, normalize);
      if (containsPoint(aBsp, bbMin)) {
        // The space is fully enclosed; bIn is redundant.
        s.push([...aOut, ...aIn, ...bOut]);
      } else {
        s.push([...aOut, ...aIn, ...bOut]);
        // The space is fully vacated; nothing overlaps b.
        s.push([...a, ...b]);
      }
    } else if (bIn.length === 0) {
      const bbMin = max(aBB[MIN], bBB[MIN]);
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = toBspFromPolygons(b, normalize);
      if (containsPoint(bBsp, bbMin)) {
        // The space is fully enclosed; aIn is redundant.
        s.push([...aOut, ...bIn, ...bOut]);
      } else {
        // The space is fully vacated; nothing overlaps a.
        s.push([...a, ...b]);
      }
    } else {
      const aTrimmed = removeInteriorPolygonsForUnionKeepingOverlap(bBsp, aIn, normalize);
      const bTrimmed = removeInteriorPolygonsForUnionDroppingOverlap(aBsp, bIn, normalize);

      s.push(clean([...aOut, ...bTrimmed, ...bOut, ...aTrimmed]));
    }
  }
  return toSolidFromPolygons({}, s[0], normalize);
};
