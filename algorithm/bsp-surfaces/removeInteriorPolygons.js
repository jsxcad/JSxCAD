import { splitPolygon } from './splitPolygon';
import { toPlane } from '@jsxcad/math-poly3';

const FRONT = 1;
const BACK = 2;
const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

// Remove from surfaces those parts that are inside the solid delineated by bsp.
export const removeInteriorPolygons = (bsp, polygons, alsoRemoveCoplanarFront = false) => {
  if (bsp === null || bsp.same === null || polygons === null) {
    return polygons;
  }
  if (polygons.length === 0) {
    return null;
  }
  const plane = toPlane(bsp.same[0]);
  let front = null;
  let back = null;

  const emit = (polygon, kind) => {
    switch (kind) {
      case COPLANAR_BACK:
      case BACK:
        if (back === null) { back = [polygon]; } else { back.push(polygon); }
        break;
      case COPLANAR_FRONT:
        if (alsoRemoveCoplanarFront) {
          if (back === null) { back = [polygon]; } else { back.push(polygon); }
        } else {
          if (front === null) { front = [polygon]; } else { front.push(polygon); }
        }
        break;
      case FRONT:
        if (front === null) { front = [polygon]; } else { front.push(polygon); }
        break;
      default:
        throw Error('die');
    }
  };

  for (let i = 0; i < polygons.length; i++) {
    splitPolygon(plane, polygons[i], emit);
  }

  if (bsp.front !== null && front !== null) {
    front = removeInteriorPolygons(bsp.front, front, alsoRemoveCoplanarFront);
  }

  if (bsp.back !== null && back !== null) {
    back = removeInteriorPolygons(bsp.back, back, alsoRemoveCoplanarFront);
  } else {
    // These surfaces are definitely inside the volume delineated by bsp.
    // Discard them.
    back = null;
  }

  if (front === null) {
    if (back === null) { return null; } else { return back; }
  } else {
    if (back === null) { return front; } else { return front.concat(front, back); }
  }
};
