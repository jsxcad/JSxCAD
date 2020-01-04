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

export const fromPlane = (plane) => {
  const bsp = {
    back: inLeaf,
    front: outLeaf,
    kind: BRANCH,
    plane,
    same: []
  };

  return bsp;
};

const fromPolygons = (polygons) => {
  if (polygons.length === 0) {
    // Everything is outside of an empty geometry.
    return outLeaf;
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

const removeInteriorPolygons = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygons(bsp.front, front);
    const trimmedBack = removeInteriorPolygons(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsAndSkin = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsAndSkin(bsp.front, front);
    const trimmedBack = removeInteriorPolygonsAndSkin(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsKeepingSkin = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsKeepingSkin(bsp.front, front);
    const trimmedBack = removeInteriorPolygonsKeepingSkin(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsKeepingSkin2 = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsKeepingSkin2(bsp.front, front);
    const trimmedBack = removeInteriorPolygonsKeepingSkin2(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygons = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygons(bsp.front, front);
    const trimmedBack = removeExteriorPolygons(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygons2 = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygons2(bsp.front, front);
    const trimmedBack = removeExteriorPolygons2(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsAndSkin = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */front,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsAndSkin(bsp.front, front);
    const trimmedBack = removeExteriorPolygonsAndSkin(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsKeepingSkin = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsKeepingSkin(bsp.front, front);
    const trimmedBack = removeExteriorPolygonsKeepingSkin(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

const dividePolygons = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = dividePolygons(bsp.front, front);
    const trimmedBack = dividePolygons(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
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
  dividePolygons,
  fromPolygons,
  fromSolid,
  inLeaf,
  outLeaf,
  removeExteriorPolygons,
  removeExteriorPolygons2,
  removeExteriorPolygonsAndSkin,
  removeExteriorPolygonsKeepingSkin,
  removeInteriorPolygons,
  removeInteriorPolygonsAndSkin,
  removeInteriorPolygonsKeepingSkin,
  removeInteriorPolygonsKeepingSkin2,
  toPolygons,
  toString
};
