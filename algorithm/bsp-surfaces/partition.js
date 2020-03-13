import {
  boundPolygons,
  fromBoundingBoxes,
  fromPolygons,
  fromSolid,
} from './bsp';

export const boxPartition = (bbBsp, aBB, bBB, bbOutLeaf, aPolygons, normalize) => {
  const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
  const aBsp = fromBoundingBoxes(aBB, bBB, bbOutLeaf, fromPolygons(aIn, normalize));
  return [aIn, aOut, aBsp];
};

export const nullPartition = (bbBsp, aBB, bBB, bbOutLeaf, aSolid, normalize) => {
  const aIn = aSolid;
  const aBsp = fromSolid(aIn, normalize);
console.log(`QQ/nullPartition/aIn: ${JSON.stringify(aIn)}`);
console.log(`QQ/nullPartition/aBsp: ${JSON.stringify(aBsp)}`);
  return [aIn, [], aBsp];
};

// export default boxPartition;
export default nullPartition;
