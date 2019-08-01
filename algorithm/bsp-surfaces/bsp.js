import { splitPolygon } from './splitPolygon';
import { toPlane } from '@jsxcad/math-poly3';

const FRONT = 1;
const BACK = 2;

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

const BRANCH = 0;
const IN_LEAF = 1;
const OUT_LEAF = 2;

const inLeaf = {
  plane: [0, 0, 0, 0],
  same: [],
  kind: IN_LEAF
};

inLeaf.back = inLeaf;
inLeaf.front = inLeaf;

const outLeaf = {
  plane: [0, 0, 0, 0],
  same: [],
  kind: OUT_LEAF
};

outLeaf.back = outLeaf;
outLeaf.front = outLeaf;

const fromPolygons = (polygons) => {
  if (polygons.length === 0) {
    throw Error('die');
  }
  let same = [];
  let front = [];
  let back = [];
  let plane = toPlane(polygons[0]);

  for (const polygon of polygons) {
    splitPolygon(plane,
                 polygon,
                 /* back= */back,
                 /* coplanarBack= */same,
                 /* coplanarFront= */same,
                 /* front= */front);
  }

  const bsp = {
    back: back.length === 0 ? inLeaf : fromPolygons(back),
    front: front.length === 0 ? outLeaf : fromPolygons(front),
    kind: BRANCH,
    plane,
    same
  };

  return bsp;
};

const fromSolid = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  return fromPolygons(polygons);
};

const toPolygons = (bsp) => {
  const polygons = [];
  const walk = (bsp) => {
    switch (bsp.kind) {
      case BRANCH: {
        if (bsp.same.length > 0) {
          polygons.push(...bsp.same);
        }
        walk(bsp.back);
        walk(bsp.front);
        break;
      }
      case IN_LEAF:
      case OUT_LEAF:
        break;
    }
  };
  walk(bsp);
  return polygons;
};

const toString = (bsp) => {
  switch (bsp.kind) {
    case IN_LEAF:
      return `[IN]`;
    case OUT_LEAF:
      return `[OUT]`;
    case BRANCH:
      return `[BRANCH same: ${JSON.stringify(bsp.same)} back: ${toString(bsp.back)} front: ${toString(bsp.front)}]`;
    default:
      throw Error('die');
  }
};

export {
  BACK,
  BRANCH,
  COPLANAR_BACK,
  COPLANAR_FRONT,
  FRONT,
  IN_LEAF,
  OUT_LEAF,
  fromPolygons,
  fromSolid,
  inLeaf,
  outLeaf,
  toPolygons,
  toString
};
