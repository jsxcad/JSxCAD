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
  removeExteriorPolygonsKeepingSkin,
  fromPolygons as toBspFromPolygons,
  fromSolid as toBspFromSolid
} from './bsp';

import { containsPoint } from './containsPoint';

import { max } from '@jsxcad/math-vec3';

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

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = toPolygonsFromSolid({}, a);
    const [aIn] = boundPolygons(bbBsp, aPolygons, normalize);

    const aBsp = fromBoundingBoxes(aBB, bBB, inLeaf, toBspFromPolygons(aIn, normalize));

    const bPolygons = toPolygonsFromSolid({}, b);
    const [bIn] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, inLeaf, toBspFromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully exclosed or fully vacated.
      const aBsp = toBspFromSolid(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed.
        solids.push(toSolidFromPolygons({}, bIn));
      } else {
        // The space is fully vacated.
        return [];
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully exclosed or fully vacated.
      const bBsp = toBspFromSolid(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed.
        solids.push(toSolidFromPolygons({}, aIn));
      } else {
        // The space is fully vacated.
        return [];
      }
    } else {
      const aTrimmed = removeExteriorPolygonsKeepingSkin(bBsp, aIn, normalize);
      const bTrimmed = removeExteriorPolygonsKeepingSkin(aBsp, bIn, normalize);

      solids.push(toSolidFromPolygons({}, [...aTrimmed, ...bTrimmed], normalize));
    }
  }
  return alignVertices(solids[0], normalize);
};
