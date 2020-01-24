import { equals, splitLineSegmentByPlane } from './jsxcad-math-plane.js';
import { squaredDistance, max, min } from './jsxcad-math-vec3.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { toPolygons, fromPolygons as fromPolygons$1, alignVertices, createNormalize3 as createNormalize3$1 } from './jsxcad-geometry-solid.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { makeConvex } from './jsxcad-geometry-surface.js';
import { doesNotOverlap, measureBoundingBox, flip } from './jsxcad-geometry-polygons.js';

const EPSILON = 1e-5;
const EPSILON2 = 1e-10;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// const toType = (plane, point) => {
//   // const t = planeDistance(plane, point);
//   const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
//   if (t < -EPSILON) {
//     return BACK;
//   } else if (t > EPSILON) {
//     return FRONT;
//   } else {
//     return COPLANAR;
//   }
// };

const pointType = [];

const splitPolygon = (normalize, plane, polygon, back, coplanarBack, coplanarFront, front) => {
  if (normalize === undefined) {
    throw Error('die: no normalize');
  }
  /*
    // This slows things down on average, probably due to not having the bounding sphere computed.
    // Check for non-intersection due to distance from the plane.
    const [center, radius] = measureBoundingSphere(polygon);
    let distance = planeDistance(plane, center) + EPSILON;
    if (distance > radius) {
      front.push(polygon);
      return;
    } else if (distance < -radius) {
      back.push(polygon);
      return;
    }
  */
  let polygonType = COPLANAR;
  const polygonPlane = toPlane(polygon);
  if (polygonPlane === undefined) {
    // Degenerate polygon
    return;
  }
  if (!equals(polygonPlane, plane)) {
    for (let nth = 0; nth < polygon.length; nth++) {
      // const type = toType(plane, polygon[nth]);
      // const t = planeDistance(plane, point);
      const point = polygon[nth];
      const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
      if (t < -EPSILON) {
        polygonType |= BACK;
        pointType[nth] = BACK;
      } else if (t > EPSILON) {
        polygonType |= FRONT;
        pointType[nth] = FRONT;
      } else {
        polygonType |= COPLANAR;
        pointType[nth] = COPLANAR;
      }
    }
  }

  // Put the polygon in the correct list, splitting it when necessary.
  switch (polygonType) {
    case COPLANAR:
      if (dot(plane, polygonPlane) > 0) {
        coplanarFront.push(polygon);
      } else {
        coplanarBack.push(polygon);
      }
      return;
    case FRONT:
      front.push(polygon);
      return;
    case BACK:
      back.push(polygon);
      return;
    case SPANNING: {
      const frontPoints = [];
      const backPoints = [];
      const last = polygon.length - 1;
      let startPoint = polygon[last];
      let startType = pointType[last];
      for (let nth = 0; nth < polygon.length; nth++) {
        const endPoint = polygon[nth];
        const endType = pointType[nth];
        if (startType !== BACK) {
          // The inequality is important as it includes COPLANAR points.
          frontPoints.push(startPoint);
        }
        if (startType !== FRONT) {
          // The inequality is important as it includes COPLANAR points.
          backPoints.push(startPoint);
        }
        if ((startType | endType) === SPANNING) {
          // This should exclude COPLANAR points.
          // Compute the point that touches the splitting plane.
          // const spanPoint = splitLineSegmentByPlane(plane, ...[startPoint, endPoint].sort());
          const spanPoint = splitLineSegmentByPlane(plane, startPoint, endPoint);
          if (squaredDistance(spanPoint, startPoint) > EPSILON2) {
            frontPoints.push(spanPoint);
          }
          if (squaredDistance(spanPoint, endPoint) > EPSILON2) {
            backPoints.push(spanPoint);
          }
        }
        startPoint = endPoint;
        startType = endType;
      }
      if (frontPoints.length >= 3) {
        frontPoints.plane = polygon.plane;
        if (backPoints.length >= 3) {
          frontPoints.parent = polygon;
          frontPoints.sibling = backPoints;
        }
        front.push(frontPoints);
      }
      if (backPoints.length >= 3) {
        backPoints.plane = polygon.plane;
        if (frontPoints.length >= 3) {
          backPoints.parent = polygon;
          backPoints.sibling = frontPoints;
        }
        back.push(backPoints);
      }
      break;
    }
  }
};

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

const fromBoundingBoxes = ([aMin, aMax], [bMin, bMax], front = outLeaf, back = inLeaf) => {
  const cMin = max(aMin, bMin);
  const cMax = min(aMax, bMax);
  return {
    // Bottom
    kind: BRANCH,
    plane: [0, 0, -1, -(cMin[Z] - EPSILON * 10)],
    front,
    back: {
      // Top
      kind: BRANCH,
      plane: [0, 0, 1, cMax[Z] + EPSILON * 10],
      front,
      back: {
        // Left
        kind: BRANCH,
        plane: [-1, 0, 0, -(cMin[X] - EPSILON * 10)],
        front,
        back: {
          // Right
          kind: BRANCH,
          plane: [1, 0, 0, cMax[X] + EPSILON * 10],
          front,
          back: {
            // Back
            kind: BRANCH,
            plane: [0, -1, 0, -(cMin[Y] - EPSILON * 10)],
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
    splitPolygon(normalize,
                 plane,
                 polygon,
                 /* back= */back,
                 /* coplanarBack= */same,
                 /* coplanarFront= */same,
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

// let mergeCount = 0;
// let mergeParentCount = 0;

// Merge the result of a split.
const merge = (front, back) => {
  const merged = [];
  for (const polygon of back) {
    // mergeCount++;
    if (polygon.leaf) {
      if (polygon.sibling && polygon.sibling.leaf === polygon.leaf) {
        polygon.parent.leaf = polygon.leaf;
        merged.push(polygon.parent);
        // mergeParentCount++;
      } else {
        merged.push(polygon);
      }
    }
  }
  for (const polygon of front) {
    if (!polygon.parent || polygon.parent.leaf !== polygon.leaf) {
      merged.push(polygon);
    }
  }
  // console.log(`QQ/mergeCount: ${mergeCount}`);
  // console.log(`QQ/mergeParentCount: ${mergeParentCount}`);
  return merged;
};

const removeInteriorPolygonsKeepingSkin = (bsp, polygons, normalize) => {
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
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsKeepingSkin(bsp.front, front, normalize);
    const trimmedBack = removeInteriorPolygonsKeepingSkin(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeInteriorPolygonsKeepingSkin2 = (bsp, polygons, normalize) => {
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
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygonsKeepingSkin2(bsp.front, front, normalize);
    const trimmedBack = removeInteriorPolygonsKeepingSkin2(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygons = (bsp, polygons, normalize) => {
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
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygons(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygons(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygons2 = (bsp, polygons, normalize) => {
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
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygons2(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygons2(bsp.back, back, normalize);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return merge(trimmedFront, trimmedBack);
    }
  }
};

const removeExteriorPolygonsKeepingSkin = (bsp, polygons, normalize) => {
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
                   /* coplanarBack= */back,
                   /* coplanarFront= */back,
                   /* front= */front);
    }
    const trimmedFront = removeExteriorPolygonsKeepingSkin(bsp.front, front, normalize);
    const trimmedBack = removeExteriorPolygonsKeepingSkin(bsp.back, back, normalize);

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
                   /* coplanarBack= */front,
                   /* coplanarFront= */back,
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
const separatePolygons = (bsp, polygons, normalize) => {
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
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = separatePolygons(bsp.front, front, normalize);
    const trimmedBack = separatePolygons(bsp.back, back, normalize);

    return [...trimmedFront, ...trimmedBack];
  }
};

const boundPolygons = (bsp, polygons, normalize) => {
  const inPolygons = [];
  const outPolygons = [];
  for (const polygon of separatePolygons(bsp, polygons, normalize)) {
    if (polygon.leaf === inLeaf) {
      inPolygons.push(polygon);
    } else if (polygon.leaf === outLeaf) {
      outPolygons.push(polygon);
    }
  }
  return [inPolygons, outPolygons];
};

const cut = (solid, surface) => {
  const normalize = createNormalize3();

  // Build a classifier from the planar polygon.
  const cutBsp = fromPolygons(surface, normalize);
  const solidPolygons = toPolygons({}, solid);

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygons(cutBsp, solidPolygons, normalize);

  // The solid will have holes that need to be patched with the parts of the
  // planar polygon that are on the solid boundary.
  const solidBsp = fromPolygons(solidPolygons, normalize);
  const trimmedPolygons = removeExteriorPolygons(solidBsp, surface, normalize);

  return fromPolygons$1({}, [...trimmedSolid, ...trimmedPolygons]);
};

const cutOpen = (solid, surface) => {
  const normalize = createNormalize3();

  // Build a classifier from the planar polygon.
  const cutBsp = fromPolygons(surface, normalize);
  const solidPolygons = toPolygons({}, solid);

  // Classify the solid with it.
  const trimmedSolid = removeExteriorPolygons(cutBsp, solidPolygons, normalize);

  return fromPolygons$1({}, trimmedSolid);
};

const containsPoint = (bsp, point) => {
  while (true) {
    if (bsp === inLeaf) {
      return true;
    } else if (bsp === outLeaf) {
      return false;
    } else {
      const plane = bsp.plane;
      // const t = planeDistance(plane, point);
      const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
      if (t <= 0) {
        // Consider points on the surface to be contained.
        bsp = bsp.back;
      } else {
        bsp = bsp.front;
      }
    }
  }
};

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const walkX = (min, max, resolution) => {
  if (min[X$1] + resolution > max[X$1]) {
    return inLeaf;
  }
  const midX = (min[X$1] + max[X$1]) / 2;
  return {
    back: walkY(min, [midX, max[Y$1], max[Z$1]], resolution),
    front: walkY([midX, min[Y$1], min[Z$1]], max, resolution),
    kind: BRANCH,
    plane: [1, 0, 0, midX],
    same: []
  };
};

const walkY = (min, max, resolution) => {
  if (min[Y$1] + resolution > max[Y$1]) {
    return inLeaf;
  }
  const midY = (min[Y$1] + max[Y$1]) / 2;
  return {
    back: walkZ(min, [max[X$1], midY, max[Z$1]], resolution),
    front: walkZ([min[X$1], midY, min[Z$1]], max, resolution),
    kind: BRANCH,
    plane: [0, 1, 0, midY],
    same: []
  };
};

const walkZ = (min, max, resolution) => {
  if (min[Z$1] + resolution > max[Z$1]) {
    return inLeaf;
  }
  const midZ = (min[Z$1] + max[Z$1]) / 2;
  return {
    back: walkX(min, [max[X$1], max[Y$1], midZ], resolution),
    front: walkX([min[X$1], min[Y$1], midZ], max, resolution),
    kind: BRANCH,
    plane: [0, 0, 1, midZ],
    same: []
  };
};

const deform = (solid, transform, min, max, resolution) => {
  const normalize = createNormalize3();

  const solidPolygons = toPolygons({}, alignVertices(solid));

  const bsp = walkX(min, max, resolution);

  // Classify the solid with it.
  const dividedPolygons = [];

  for (const polygon of dividePolygons(bsp, solidPolygons, normalize)) {
    if (polygon.length > 3) {
      for (const triangle of makeConvex([polygon])) {
        dividedPolygons.push(triangle);
      }
    } else if (polygon.length === 3) {
      dividedPolygons.push(polygon);
    }
  }

  const realignedPolygons = alignVertices([dividedPolygons])[0];

  const vertices = new Map();

  for (const path of realignedPolygons) {
    for (const point of path) {
      const tag = JSON.stringify(point);
      if (!vertices.has(tag)) {
        vertices.set(tag, transform(point));
      }
    }
  }

  // Now the solid should have vertexes at the given heights, and we can apply the transform.
  const transformedPolygons = realignedPolygons.map(path => path.map(point => vertices.get(JSON.stringify(point))));

  return fromPolygons$1({}, transformedPolygons);
};

const difference = (aSolid, ...bSolids) => {
  if (bSolids.length === 0) {
    return aSolid;
  }

  const normalize = createNormalize3$1();
  let a = toPolygons({}, alignVertices(aSolid, normalize));
  let bs = bSolids
      .map(b => toPolygons({}, alignVertices(b, normalize)))
      .filter(b => !doesNotOverlap(a, b));

  while (bs.length > 0) {
    const b = bs.shift();

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = a;
    const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, fromPolygons(aIn, normalize));

    const bPolygons = b;
    const [bIn] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, fromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = fromPolygons(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; invert b.
        a = [...aOut, ...flip(bIn)];
      } else {
        // The space is fully vacated; nothing to be cut.
        continue;
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = fromPolygons(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; only the out region remains.
        a = aOut;
      } else {
        // The space is fully vacated; nothing to cut with.
        continue;
      }
    } else {
      const aTrimmed = removeInteriorPolygonsKeepingSkin2(bBsp, aIn, normalize);
      const bTrimmed = removeExteriorPolygons2(aBsp, flip(bIn), normalize);

      // aSolid = toSolidFromPolygons({}, [...aOut, ...aTrimmed, ...bTrimmed], normalize);
      a = [...aOut, ...aTrimmed, ...bTrimmed];
    }
  }
  return fromPolygons$1({}, a, normalize);
};

// An asymmetric binary merge.
const intersection = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  if (solids.length === 1) {
    return solids[0];
  }
  const normalize = createNormalize3$1();
  const s = solids.map(solid => toPolygons({}, alignVertices(solid, normalize)));
  while (s.length > 1) {
    const a = s.shift();
    const b = s.shift();

    if (doesNotOverlap(a, b)) {
      return [];
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = a;
    const [aIn] = boundPolygons(bbBsp, aPolygons, normalize);

    const aBsp = fromBoundingBoxes(aBB, bBB, inLeaf, fromPolygons(aIn, normalize));

    const bPolygons = b;
    const [bIn] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, inLeaf, fromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully exclosed or fully vacated.
      const aBsp = fromPolygons(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed.
        s.push(bIn);
      } else {
        // The space is fully vacated.
        return [];
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully exclosed or fully vacated.
      const bBsp = fromPolygons(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed.
        s.push(aIn);
      } else {
        // The space is fully vacated.
        return [];
      }
    } else {
      const aTrimmed = removeExteriorPolygonsKeepingSkin(bBsp, aIn, normalize);
      const bTrimmed = removeExteriorPolygonsKeepingSkin(aBsp, bIn, normalize);

      s.push([...aTrimmed, ...bTrimmed]);
    }
  }
  return fromPolygons$1({}, s[0], normalize);
};

const section = (solid, surfaces) => {
  const normalize = createNormalize3();
  const bsp = fromSolid(alignVertices(solid, normalize), normalize);
  return surfaces.map(surface => removeExteriorPolygons(bsp, surface, normalize));
};

// An asymmetric binary merge.
const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  if (solids.length === 1) {
    return solids[0];
  }
  const normalize = createNormalize3$1();
  const s = solids.map(solid => toPolygons({}, alignVertices(solid, normalize)));
  while (s.length >= 2) {
    const a = s.shift();
    const b = s.shift();

    if (doesNotOverlap(a, b)) {
      s.push([...a, ...b]);
      continue;
    }

    const aBB = measureBoundingBox(a);
    const bBB = measureBoundingBox(b);
    const bbBsp = fromBoundingBoxes(aBB, bBB, outLeaf, inLeaf);

    const aPolygons = a;
    const [aIn, aOut] = boundPolygons(bbBsp, aPolygons, normalize);
    const aBsp = fromBoundingBoxes(aBB, bBB, outLeaf, fromPolygons(aIn, normalize));

    const bPolygons = b;
    const [bIn, bOut] = boundPolygons(bbBsp, bPolygons, normalize);
    const bBsp = fromBoundingBoxes(aBB, bBB, outLeaf, fromPolygons(bIn, normalize));

    if (aIn.length === 0) {
      // There are two ways for aIn to be empty: the space is fully enclosed or fully vacated.
      const aBsp = fromPolygons(a, normalize);
      if (containsPoint(aBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; bIn is redundant.
        s.push([...aOut, ...aIn, ...bOut]);
      } else {
        s.push([...aOut, ...aIn, ...bOut]);
        // The space is fully vacated; nothing overlaps b.
        s.push([...a, ...b]);
      }
    } else if (bIn.length === 0) {
      // There are two ways for bIn to be empty: the space is fully enclosed or fully vacated.
      const bBsp = fromPolygons(b, normalize);
      if (containsPoint(bBsp, max(aBB[0], bBB[1]))) {
        // The space is fully enclosed; aIn is redundant.
        s.push([...aOut, ...bIn, ...bOut]);
      } else {
        // The space is fully vacated; nothing overlaps a.
        s.push([...a, ...b]);
      }
    } else {
      const aTrimmed = removeInteriorPolygonsKeepingSkin(bBsp, aIn, normalize);
      const bTrimmed = removeInteriorPolygonsKeepingSkin(aBsp, bIn, normalize);

      s.push([...aOut, ...aTrimmed, ...bOut, ...bTrimmed]);
    }
  }
  return fromPolygons$1({}, s[0], normalize);
};

export { containsPoint, cut, cutOpen, deform, difference, fromSolid, intersection, section, union };
