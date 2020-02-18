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
  removeInteriorPolygonsForUnionDroppingOverlap,
  removeInteriorPolygonsForUnionKeepingOverlap,
  fromPolygons as toBspFromPolygons,
  toString as toStringFromBsp
} from './bsp';

import {
  doesNotOverlap,
  measureBoundingBox
} from '@jsxcad/geometry-polygons';

import { containsPoint } from './containsPoint';
import { max } from '@jsxcad/math-vec3';

// An asymmetric binary merge.
export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  if (solids.length === 1) {
    return solids[0];
  }
  const normalize = createNormalize3();
  const s = solids.map(solid => toPolygonsFromSolid({}, alignVertices(solid, normalize)));
  while (s.length >= 2) {
    const a = s.shift();
    const b = s.shift();

    if (doesNotOverlap(a, b)) {
      s.push([...a, ...b]);
console.log(`QQ/1`);
      continue;
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = a;
    // const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    // const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(aIn, normalize));
    const [aIn, aOut] = [aPolygons, []];
    const aBsp = toBspFromPolygons(aIn, normalize);
    if (aOut.length > 0) console.log(`QQ/aOut`);

    const bPolygons = b;
    // const [bIn, bOut] = boundPolygons(bbBsp, bPolygons, normalize);
    // const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, toBspFromPolygons(bIn, normalize));
    const [bIn, bOut] = [bPolygons, []];
    const bBsp = toBspFromPolygons(bIn, normalize);
    if (bOut.length > 0) console.log(`QQ/bOut`);

    if (aIn.length === 0) {
console.log(`QQ/2`);
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = toBspFromPolygons(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
console.log(`QQ/3`);
        // The space is fully enclosed; bIn is redundant.
        s.push([...aOut, ...aIn, ...bOut]);
      } else {
console.log(`QQ/4`);
        s.push([...aOut, ...aIn, ...bOut]);
        // The space is fully vacated; nothing overlaps b.
        s.push([...a, ...b]);
      }
    } else if (bIn.length === 0) {
console.log(`QQ/5`);
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = toBspFromPolygons(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
console.log(`QQ/6`);
        // The space is fully enclosed; aIn is redundant.
        s.push([...aOut, ...bIn, ...bOut]);
      } else {
console.log(`QQ/7`);
        // The space is fully vacated; nothing overlaps a.
        s.push([...a, ...b]);
      }
    } else {
console.log(`QQ/8`);
console.log(`QQ/aBsp: ${toStringFromBsp(aBsp)}`);
console.log(`QQ/bBsp: ${toStringFromBsp(bBsp)}`);
      const aTrimmed = removeInteriorPolygonsForUnionKeepingOverlap(bBsp, aIn, normalize);
      // const aTrimmed = removeInteriorPolygonsForUnionDroppingOverlap(bBsp, aIn, normalize);
      const bTrimmed = removeInteriorPolygonsForUnionDroppingOverlap(aBsp, bIn, normalize);

      s.push(clean([...aOut, ...aTrimmed, ...bOut, ...bTrimmed]));
      // s.push(clean([...aOut, ...bTrimmed, ...bOut, ...aTrimmed]));
      // s.push(clean([...aTrimmed, ...bTrimmed]));
      // s.push(clean([...aOut, ...bOut]));
    }
  }
  return toSolidFromPolygons({}, s[0], normalize);
};
