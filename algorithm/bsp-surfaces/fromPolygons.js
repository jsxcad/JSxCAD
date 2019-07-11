import { splitPolygon } from './splitPolygon';
import { toPlane } from '@jsxcad/math-poly3';

const FRONT = 1;
const BACK = 2;

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

export const fromPolygons = (polygons) => {
  const bsp = { back: null, front: null, same: [] };

  let front = null;
  let back = null;
  let plane = toPlane(polygons[0]);

  const emit = (polygon, kind) => {
    switch (kind) {
      case BACK:
        if (back === null) { back = [polygon]; } else { back.push(polygon); }
        break;
      case COPLANAR_BACK:
        throw Error('die');
      case COPLANAR_FRONT:
        bsp.same.push(polygon);
        break;
      case FRONT:
        if (front === null) { front = [polygon]; } else { front.push(polygon); }
        break;
    }
  };

  for (const polygon of polygons) {
    splitPolygon(plane, polygon, emit);
  }

  if (back !== null) {
    bsp.back = fromPolygons(back);
  }

  if (front !== null) {
    bsp.front = fromPolygons(front);
  }

  return bsp;
};
