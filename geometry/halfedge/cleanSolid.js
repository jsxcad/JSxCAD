import fromSolid from './fromSolid';
// import { junctionSelector } from './junction';
import merge from './merge';
import toSolid from './toSolid';

export const cleanSolid = (solid, normalize) => {
  for (const surface of solid) {
    console.log(`QQ/surface/length: ${surface.length}`);
  }
  const loops = fromSolid(solid, normalize, /* closed= */true);
  console.log(`QQ/loops/length: ${loops.length}`);
  // const selectJunction = junctionSelector(solid, normalize);
  const merged = merge(loops);
  // return toSolid(merged, selectJunction);
  return toSolid(merged, n => true);
};

export default cleanSolid;
