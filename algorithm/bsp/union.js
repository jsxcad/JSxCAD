import { build } from './build';
import { clipTo } from './clipTo';
import { fromPolygons } from './fromPolygons';
import { invert } from './invert';
import { toPolygons } from './toPolygons';

export const union = (...solids) => {
  while (solids.length > 1) {
    const aSolid = solids.shift();
    const bSolid = solids.shift();

    const aBsp = fromPolygons({}, aSolid);
    const bBsp = fromPolygons({}, bSolid);

    // Remove the bits of a that are in b.
    clipTo(aBsp, bBsp);

    // Remove the bits of b that are in a.
    clipTo(bBsp, aBsp);

    // Turn b inside out and remove the bits that are in a.
    // PROVE: I assume this is to simplify the internal structure of b.
    invert(bBsp);
    clipTo(bBsp, aBsp);
    invert(bBsp);

    // Now merge the two together.
    build(aBsp, toPolygons({}, bBsp));

    // And build a geometry from the result.
    solids.push(toPolygons({}, aBsp));
  }
  return solids[0];
};
