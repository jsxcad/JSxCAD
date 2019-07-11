import { BRANCH, IN_LEAF, OUT_LEAF, fromPolygons, inLeaf, outLeaf, toString } from './bsp';

import { doesNotOverlap, toPolygons } from '@jsxcad/geometry-solid';
import { fromSolid } from './fromSolid';
import { removeInterior } from './removeInterior';
import { BACK, COPLANAR_BACK, COPLANAR_FRONT, FRONT, splitPolygon } from './splitPolygon';
import { toSolid } from './toSolid';

const op = (bsp, polygons) => {
console.log(`QQ/op/bsp: ${toString(bsp)}`);
console.log(`QQ/op/polygons: ${JSON.stringify(polygons)}`);
  switch (bsp.kind) {
    case BRANCH: {
      let back = [];
      let front = [];
      const emit = (polygon, kind) => {
        switch (kind) {
          case COPLANAR_BACK:
          case BACK:
            back.push(polygon);
            break;
          case COPLANAR_FRONT:
          case FRONT:
            front.push(polygon);
            break;
          default: {
            throw Error('die');
          }
        }
      }
      for (const polygon of polygons) {
        splitPolygon(bsp.plane, polygon, emit);
      }
      return {
               ...bsp,
               back: back.length === 0 ? inLeaf : op(bsp.back, back),
               front: front.length === 0 ? outLeaf, op(bsp.front, front)
             };
      break;
    }
    case IN_LEAF: {
      return bsp;
    }
    case OUT_LEAF: {
      return polygons.length >= 1 ? fromPolygons(polygons) : bsp;
    }
    default: {
      throw Error('die');
    }
  }
}

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
      const b = toPolygons({}, bSolid);

      const unioned = op(a, b);

      solids.push(toSolid(unioned));
    }
  }
  return solids[0];
};
