import { build } from './build';
import { clipTo } from './clipTo';
import { fromSurfaces } from './fromSurfaces';
import { flip } from './flip';
import { toSurfaces } from './toSurfaces';

export const union = (...solids) => {
  while (solids.length > 1) {
    const aSolid = solids.shift();
    const bSolid = solids.shift();

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
  return solids[0];
};
