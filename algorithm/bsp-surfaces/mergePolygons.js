import { BACK, BRANCH, COPLANAR_BACK, COPLANAR_FRONT, FRONT, IN_LEAF, OUT_LEAF, fromPolygons } from './bsp';

import { splitPolygon } from './splitPolygon';

// Remove from surfaces those parts that are inside the solid delineated by bsp.
export const mergePolygons = (bsp, polygons) => {
  switch (bsp.kind) {
    case IN_LEAF:
    case OUT_LEAF:
      return fromPolygons(polygons);
    case BRANCH: {
      let frontPolygons;
      let backPolygons;
      let samePolygons;

      const emit = (polygon, kind) => {
        switch (kind) {
          case BACK:
            if (backPolygons === undefined) { backPolygons = [polygon]; } else { backPolygons.push(polygon); }
            break;
          case COPLANAR_BACK:
          case COPLANAR_FRONT:
            if (samePolygons === undefined) { samePolygons = [polygon]; } else { samePolygons.push(polygon); }
            break;
          case FRONT:
            if (frontPolygons === undefined) { frontPolygons = [polygon]; } else { frontPolygons.push(polygon); }
            break;
          default:
            throw Error(`die: ${kind}`);
        }
      };

      for (let i = 0; i < polygons.length; i++) {
        splitPolygon(bsp.plane, polygons[i], emit);
      }

      let back = bsp.back;
      let front = bsp.front;
      let same = bsp.same;

      if (frontPolygons !== undefined) {
        front = mergePolygons(bsp.front, frontPolygons);
      }

      if (backPolygons !== undefined) {
        back = mergePolygons(bsp.back, backPolygons);
      }

      if (samePolygons !== undefined) {
        same = same.concat(samePolygons);
      }

      const merged = {
        back,
        front,
        kind: BRANCH,
        plane: bsp.plane,
        same
      };

      return merged;
    }
  }
};
