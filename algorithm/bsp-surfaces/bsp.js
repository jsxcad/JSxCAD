import { EPSILON, splitPolygon } from './splitPolygon';
import { max, min } from '@jsxcad/math-vec3';

import { toPlane } from '@jsxcad/math-poly3';

const FRONT = 1;
const BACK = 2;

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

const BRANCH = 0;
const IN_LEAF = 1;
const OUT_LEAF = 2;

const X = 0;
const Y = 1;
const Z = 2;

const inLeaf = {
  plane: null,
  same: [],
  kind: IN_LEAF,
  back: null,
  front: null
};

const outLeaf = {
  plane: null,
  same: [],
  kind: OUT_LEAF,
  back: null,
  front: null
};

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

const fromBoundingBoxes = ([aMin, aMax], [bMin, bMax], front = outLeaf, back = inLeaf) => {
  const cMin = max(aMin, bMin);
  const cMax = min(aMax, bMax);
  const bsp = {
    // Bottom
    kind: BRANCH,
    plane: [0, 0, -1, -cMin[Z] + EPSILON * 10],
    front,
    back: {
      // Top
      kind: BRANCH,
      plane: [0, 0, 1, cMax[Z] + EPSILON * 10],
      front,
      back: {
        // Left
        kind: BRANCH,
        plane: [-1, 0, 0, -cMin[X] + EPSILON * 10],
        front,
        back: {
          // Right
          kind: BRANCH,
          plane: [1, 0, 0, cMax[X] + EPSILON * 10],
          front,
          back: {
            // Back
            kind: BRANCH,
            plane: [0, -1, 0, -cMin[Y] + EPSILON * 10],
            front,
            back: {
              // Front
              kind: BRANCH,
              plane: [0, 1, 0, cMax[Y] + EPSILON * 10],
              front: outLeaf,
              back
            }
          }
        }
      }
    }
  };
  return bsp;
};

const fromPolygons = (polygons, normalize) => {
  if (polygons.length === 0) {
    // Everything is outside of an empty geometry.
    return outLeaf;
  }
  let same = [];
  let front = [];
  let back = [];
  let plane = toPlane(polygons[polygons.length >> 1]);

  for (const polygon of polygons) {
    if (toPlane([...polygon]) === undefined) {
      continue;
    }
    splitPolygon(normalize,
                 plane,
                 polygon,
                 /* back= */back,
                 /* abutting= */back,
                 /* overlapping= */same,
                 /* front= */front);
  }

  const bsp = {
    back: back.length === 0 ? inLeaf : fromPolygons(back, normalize),
    front: front.length === 0 ? outLeaf : fromPolygons(front, normalize),
    kind: BRANCH,
    plane,
    same
  };

  return bsp;
};

const fromSolid = (solid, normalize) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  return fromPolygons(polygons, normalize);
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
      return `[BRANCH plane: ${JSON.stringify(bsp.plane)} back: ${toString(bsp.back)} front: ${toString(bsp.front)}]`;
    default:
      throw Error('die');
  }
};

const keepIn = (polygons) => {
  for (const polygon of polygons) {
    polygon.leaf = inLeaf;
  }
  return polygons;
};

const keepOut = (polygons) => {
  for (const polygon of polygons) {
    polygon.leaf = outLeaf;
  }
  return polygons;
};

// Merge the result of a split.
const merge = (front, back) => {
  const merged = [];
  const scan = (polygons) => {
    for (const polygon of polygons) {
      if (polygon.leaf) {
        if (polygon.sibling && polygon.sibling.leaf === polygon.leaf) {
          polygon.parent.leaf = polygon.leaf;
          polygon.leaf = null;
          polygon.sibling.leaf = undefined;
          merged.push(polygon.parent);
        } else {
          merged.push(polygon);
        }
      }
    }
  };
  scan(front);
  scan(back);
  return merged;
};

export const clean = (polygons) => {
  for (const polygon of polygons) {
    delete polygon.parent;
    delete polygon.sibling;
  }
  return polygons;
};

const removeInteriorPolygonsForUnionKeepingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return keepOut(polygons);
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */back,
                   /* overlapping= */front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsForUnionKeepingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeInteriorPolygonsForUnionKeepingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsForUnionDroppingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return keepOut(polygons);
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */back,
                   /* overlapping= */back,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsForUnionDroppingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeInteriorPolygonsForUnionDroppingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsForDifference = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return keepOut(polygons);
  } else {
    const outward = [];
    const inward = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */inward,
                   /* abutting= */outward,
                   /* overlapping= */inward,
                   /* front= */outward);
    }
    const trimmedFront = removeInteriorPolygonsForDifference(bsp.front, outward, normalize);
    const trimmedBack = removeInteriorPolygonsForDifference(bsp.back, inward, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForSection = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsForSection(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsForSection(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForCutDroppingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */front,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsForCutDroppingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsForCutDroppingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForCutKeepingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsForCutKeepingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsForCutKeepingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForDifference = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const outward = [];
    const inward = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */inward,
                   /* abutting= */inward, // difference facing are kept
                   /* overlapping= */outward, // same facing are removed
                   /* front= */outward);
    }
    const trimmedFront = removeExteriorPolygonsForDifference(bsp.front, outward, normalize);
    const trimmedBack = removeExteriorPolygonsForDifference(bsp.back, inward, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForIntersectionKeepingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsForIntersectionKeepingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsForIntersectionKeepingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsForIntersectionDroppingOverlap = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return [];
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */front,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsForIntersectionDroppingOverlap(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsForIntersectionDroppingOverlap(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

// Don't merge the fragments for this one.
const dividePolygons = (bsp, polygons, normalize) => {
  if (bsp === inLeaf) {
    return polygons;
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* abutting= */front,
                   /* overlapping= */back,
                   /* front= */front);
    }
    const trimmedFront = dividePolygons(bsp.front, front, normalize);
    const trimmedBack = dividePolygons(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

// Merge the fragments for this one.
const separatePolygonsSkinIn = (bsp, polygons, normalize) => {
  if (polygons.length === 0) {
    return [];
  } else if (bsp === inLeaf) {
    return keepIn(polygons);
  } else if (bsp === outLeaf) {
    return keepOut(polygons);
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(normalize,
                   bsp.plane,
                   polygons[i],
                   /* back= */back, // toward keepIn
                   /* abutting= */back, // toward keepIn
                   /* overlapping= */back, // toward keepIn
                   /* front= */front); // toward keepOut
    }
    const trimmedFront = separatePolygonsSkinIn(bsp.front, front, normalize);
    const trimmedBack = separatePolygonsSkinIn(bsp.back, back, normalize);

    return [...trimmedFront, ...trimmedBack];
  }
};

const boundPolygons = (bsp, polygons, normalize) => {
  const inPolygons = [];
  const outPolygons = [];
  for (const polygon of separatePolygonsSkinIn(bsp, polygons, normalize)) {
    if (polygon.leaf === inLeaf) {
      inPolygons.push(polygon);
    } else if (polygon.leaf === outLeaf) {
      outPolygons.push(polygon);
    }
  }
  return [clean(inPolygons), clean(outPolygons)];
};

export {
  BACK,
  BRANCH,
  COPLANAR_BACK,
  COPLANAR_FRONT,
  FRONT,
  IN_LEAF,
  OUT_LEAF,
  boundPolygons,
  dividePolygons,
  fromBoundingBoxes,
  fromPolygons,
  fromSolid,
  inLeaf,
  outLeaf,
  removeExteriorPolygonsForSection,
  removeExteriorPolygonsForCutDroppingOverlap,
  removeExteriorPolygonsForCutKeepingOverlap,
  removeExteriorPolygonsForDifference,
  removeInteriorPolygonsForUnionKeepingOverlap,
  removeInteriorPolygonsForUnionDroppingOverlap,
  removeExteriorPolygonsForIntersectionDroppingOverlap,
  removeExteriorPolygonsForIntersectionKeepingOverlap,
  removeInteriorPolygonsForDifference,
  toPolygons,
  toString
};
