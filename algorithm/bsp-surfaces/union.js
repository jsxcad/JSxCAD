import { doesNotOverlap } from '@jsxcad/geometry-solid';
import { fromSolid } from './fromSolid';
import { removeInterior } from './removeInterior';
import { toSolid } from './toSolid';

export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  while (solids.length > 1) {
    const aSolid = solids.shift();
    const bSolid = solids.shift();

    if (doesNotOverlap(aSolid, bSolid)) {
      // Simple composition suffices.
      solids.push([...aSolid, ...bSolid]);
    } else {
      const a = fromSolid(aSolid);
      const b = fromSolid(bSolid);

      // FIX: See if we can apply work stealing.

      const aOutsideB = removeInterior(a, b);
      const bOutsideA = removeInterior(b, a);

      solids.push([...toSolid(aOutsideB), ...toSolid(bOutsideA)]);
    }
  }
  return solids[0];
};
