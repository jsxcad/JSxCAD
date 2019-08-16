import { build } from './build';
import { clipTo } from './clipTo';
import { doesNotOverlap } from '@jsxcad/geometry-solid';
import { flip } from './flip';
import { fromSurfaces } from './fromSurfaces';
import { toSurfaces } from './toSurfaces';

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
      const aBsp = fromSurfaces({}, aSolid);
      const bBsp = fromSurfaces({}, bSolid);

      // Remove the bits of a that are in b.
      clipTo(aBsp, bBsp);

      // Remove the bits of b that are in a.
      clipTo(bBsp, aBsp);

      // Turn b inside out and remove the bits that are in a.
      flip(bBsp);
      clipTo(bBsp, aBsp);
      flip(bBsp);

      // Now merge the two together.
      build(aBsp, toSurfaces({}, bBsp));

      // And build a geometry from the result.
      solids.push(toSurfaces({}, aBsp));
    }
  }
  return solids[0];
};
