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
  removeInteriorPolygonsKeepingSkin,
  fromPolygons as toBspFromPolygons,
  fromSolid as toBspFromSolid
} from './bsp';

import { containsPoint } from './containsPoint';

import { max } from '@jsxcad/math-vec3';

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const normalize = createNormalize3();
  while (solids.length > 1) {
    const a = alignVertices(solids.shift(), normalize);
    const b = alignVertices(solids.shift(), normalize);

    if (doesNotOverlap(a, b)) {
      solids.push([...a, ...b]);
      continue;
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = toPolygonsFromSolid({}, a);
    const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(aIn, normalize));

    const bPolygons = toPolygonsFromSolid({}, b);
    const [bIn, bOut] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = toBspFromSolid(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; bIn is redundant.
        solids.push(toSolidFromPolygons({}, [...aOut, ...aIn, ...bOut]));
      } else {
        solids.push(toSolidFromPolygons({}, [...aOut, ...aIn, ...bOut]));
        // The space is fully vacated; nothing overlaps b.
        solids.push([...a, ...b]);
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = toBspFromSolid(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; aIn is redundant.
        solids.push(toSolidFromPolygons({}, [...aOut, ...bIn, ...bOut]));
      } else {
        // The space is fully vacated; nothing overlaps a.
        solids.push([...a, ...b]);
      }
    } else {
      const aTrimmed = removeInteriorPolygonsKeepingSkin(bBsp, aIn, normalize);
      const bTrimmed = removeInteriorPolygonsKeepingSkin(aBsp, bIn, normalize);

      solids.push(toSolidFromPolygons({}, [...aOut, ...aTrimmed, ...bOut, ...bTrimmed], normalize));
    }
  }
  return alignVertices(solids[0], normalize);
};
