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
  fromPolygons as toBspFromPolygons
} from './bsp';

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

    const aTrimmed = removeInteriorPolygonsKeepingSkin(bBsp, aIn, normalize);
    const bTrimmed = removeInteriorPolygonsKeepingSkin(aBsp, bIn, normalize);

    solids.push(toSolidFromPolygons({}, [...aOut, ...aTrimmed, ...bOut, ...bTrimmed], normalize));
  }
  return alignVertices(solids[0], normalize);
};
