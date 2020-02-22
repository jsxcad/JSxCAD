import {
  alignVertices,
  createNormalize3,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  boundPolygons,
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
import { max } from '@jsxcad/math-vec3';

const MIN = 0;

export const difference = (aSolid, ...bSolids) => {
  if (bSolids.length === 0) {
    return aSolid;
  }

  const normalize = createNormalize3();
  let a = toPolygonsFromSolid({}, alignVertices(aSolid, normalize));
  let bs = bSolids
      .map(b => toPolygonsFromSolid({}, alignVertices(b, normalize)))
      .filter(b => !doesNotOverlap(a, b));

  while (bs.length > 0) {
    const b = bs.shift();

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = a;
    const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(aIn, normalize));

    const bPolygons = b;
    const [bIn] = boundPolygons(bbBsp, bPolygons, normalize);
    // const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(bIn, normalize));
    // const bBsp = toBspFromPolygons(bIn, normalize);
    const bBsp = toBspFromPolygons(bPolygons, normalize);

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
      const aTrimmed = removeInteriorPolygonsForDifference(bBsp, aIn, normalize);
      const bTrimmed = removeExteriorPolygonsForDifference(aBsp, bIn, normalize);

      a = clean([...aOut, ...aTrimmed, ...flip(bTrimmed)]);
    }
  }
  return toSolidFromPolygons({}, a, normalize);
};
