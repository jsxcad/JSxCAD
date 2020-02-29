import {
  boundPolygons,
  fromBoundingBoxes,
  fromPolygons,
  outLeaf
} from './bsp';

export const boxPartition = (bbBsp, aBB, bBB, aPolygons, normalize) => {
  const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
  const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, fromPolygons(aIn, normalize));
  return [aIn, aOut, aBsp];
}

export const nullPartition = (bbBsp, aBB, bBB, aPolygons, normalize) => {
  const aIn = aPolygons;
  const aBsp = fromPolygons(aIn, normalize);
  return [aIn, [], aBsp];
}

export default boxPartition;
