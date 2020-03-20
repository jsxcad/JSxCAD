import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { distance, scale as scale$1, add } from './jsxcad-math-vec3.js';
import { getEdges, deduplicate } from './jsxcad-geometry-path.js';
import { pushWhenValid } from './jsxcad-geometry-polygons.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { transform as transform$1, assertGood as assertGood$1, canonicalize as canonicalize$1, measureBoundingBox as measureBoundingBox$1, eachPoint as eachPoint$1, flip as flip$1, retessellate, makeConvex, toPlane as toPlane$1, outline as outline$1 } from './jsxcad-geometry-surface.js';

const THRESHOLD = 1e-5;

// We expect a solid of reconciled triangles.

const watertight = Symbol('watertight');

const X = 0;
const Y = 1;
const Z = 2;

const orderVertices = (a, b) => {
  const dX = a[X] - b[X];
  if (dX !== 0) return dX;
  const dY = a[Y] - b[Y];
  if (dY !== 0) return dY;
  const dZ = a[Z] - b[Z];
  return dZ;
};

const makeWatertight = (solid, normalize, threshold = THRESHOLD) => {
  if (!solid[watertight]) {
    if (isWatertight(solid)) {
      solid[watertight] = solid;
    }
  }

  if (!solid[watertight]) {
    if (normalize === undefined) {
      normalize = createNormalize3(1 / threshold);
    }

    const vertices = new Set();

    const reconciledSolid = [];
    for (const surface of solid) {
      const reconciledSurface = [];
      for (const path of surface) {
        const reconciledPath = [];
        for (const point of path) {
          const reconciledPoint = normalize(point);
          reconciledPath.push(reconciledPoint);
          vertices.add(reconciledPoint);
        }
        if (toPlane(reconciledPath) !== undefined) {
          // Filter degenerates.
          reconciledSurface.push(reconciledPath);
        }
      }
      reconciledSolid.push(reconciledSurface);
    }

    const orderedVertices = [...vertices];
    orderedVertices.sort(orderVertices);
    for (let i = 0; i < orderedVertices.length; i++) {
      orderedVertices[i].index = i;
    }

    const watertightSolid = [];
    for (const surface of reconciledSolid) {
      const watertightPaths = [];
      for (const path of surface) {
        const watertightPath = [];
        for (const [start, end] of getEdges(path)) {
          watertightPath.push(start);
          const span = distance(start, end);
          const colinear = [];
          let limit = Math.max(start.index, end.index);
          for (let i = Math.min(start.index, end.index); i < limit; i++) {
            const vertex = orderedVertices[i];
            // FIX: Threshold
            if (Math.abs(distance(start, vertex) + distance(vertex, end) - span) < threshold) {
              colinear.push(vertex);
            }
          }
          // Arrange by distance from start.
          colinear.sort((a, b) => distance(start, a) - distance(start, b));
          // Insert into the path.
          watertightPath.push(...colinear);
        }
        pushWhenValid(watertightPaths, watertightPath);
      }
      watertightSolid.push(watertightPaths);
    }
    // At this point we should have the correct structure for assembly into a solid.
    // We just need to ensure triangulation to support deformation.

    solid[watertight] = watertightSolid;
  }

  return solid[watertight];
};

const isWatertight = (solid) => {
  const edges = new Set();
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        edges.add(`${JSON.stringify([start, end])}`);
      }
    }
  }
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        if (!edges.has(`${JSON.stringify([end, start])}`)) {
          return false;
        }
      }
    }
  }
  return true;
};

const transform = (matrix, solid) => solid.map(surface => transform$1(matrix, surface));

const rotateX = (radians, solid) => transform(fromXRotation(radians), solid);
const rotateY = (radians, solid) => transform(fromYRotation(radians), solid);
const rotateZ = (radians, solid) => transform(fromZRotation(radians), solid);
const scale = (vector, solid) => transform(fromScaling(vector), solid);
const translate = (vector, solid) => transform(fromTranslation(vector), solid);

const alignVertices = (solid, normalize3 = createNormalize3()) => {
  const aligned = solid.map(surface =>
    surface.map(polygon => deduplicate(polygon.map(normalize3)))
        .filter(polygon => polygon.length >= 3)
        .filter(polygon => toPlane(polygon) !== undefined));
  return aligned;
};

const assertGood = (solid) => {
  for (const surface of solid) {
    assertGood$1(surface);
  }
};

const canonicalize = (solid) => solid.map(canonicalize$1);

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (solid) => {
  if (solid.measureBoundingBox === undefined) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (const surface of solid) {
      const [minSurface, maxSurface] = measureBoundingBox$1(surface);
      if (minSurface[0] < min[0]) min[0] = minSurface[0];
      if (minSurface[1] < min[1]) min[1] = minSurface[1];
      if (minSurface[2] < min[2]) min[2] = minSurface[2];
      if (maxSurface[0] > max[0]) max[0] = maxSurface[0];
      if (maxSurface[1] > max[1]) max[1] = maxSurface[1];
      if (maxSurface[2] > max[2]) max[2] = maxSurface[2];
    }
    solid.measureBoundingBox = [min, max];
  }
  return solid.measureBoundingBox;
};

const iota = 1e-5;
const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

// Tolerates overlap up to one iota.
const doesNotOverlap = (a, b) => {
  if (a.length === 0 || b.length === 0) {
    return true;
  }
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X$1] <= minB[X$1] + iota) { return true; }
  if (maxA[Y$1] <= minB[Y$1] + iota) { return true; }
  if (maxA[Z$1] <= minB[Z$1] + iota) { return true; }
  if (maxB[X$1] <= minA[X$1] + iota) { return true; }
  if (maxB[Y$1] <= minA[Y$1] + iota) { return true; }
  if (maxB[Z$1] <= minA[Z$1] + iota) { return true; }
  return false;
};

const eachPoint = (thunk, solid) => {
  for (const surface of solid) {
    eachPoint$1(thunk, surface);
  }
};

// Expects aligned vertices.

const findOpenEdges = (solid, isOpen = true) => {
  const test = (closed) => isOpen ? !closed : closed;

  const edges = new Set();
  for (const surface of solid) {
    for (const face of surface) {
      for (const edge of getEdges(face)) {
        edges.add(JSON.stringify(edge));
      }
    }
  }
  const openEdges = [];
  for (const surface of solid) {
    for (const face of surface) {
      for (const [start, end] of getEdges(face)) {
        if (test(edges.has(JSON.stringify([end, start])))) {
          openEdges.push([start, end]);
        }
      }
    }
  }
  return openEdges;
};

const flip = (solid) => solid.map(surface => flip$1(surface));

// The resolution is 1 / multiplier.
const multiplier = 1e5;

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;
const W = 3;

const createNormalize4 = () => {
  const map = new Map();
  const normalize4 = (coordinate) => {
    // Apply a spatial quantization to the 4 dimensional coordinate.
    const nx = Math.floor(coordinate[X$2] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y$2] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z$2] * multiplier - 0.5);
    const nw = Math.floor(coordinate[W] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}/${nw}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nz0 = nz;
    const nw0 = nw;
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    const nw1 = nw0 + 1;
    // Populate the space of the quantized value and its adjacencies.
    // const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier, nw1 / multiplier];
    // FIX: Rename the function to reflect that it seems that we cannot quantize planes,
    // but we can form a consensus among nearby planes.
    const normalized = coordinate;
    map.set(`${nx0}/${ny0}/${nz0}/${nw0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz0}/${nw1}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}/${nw0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}/${nw1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}/${nw0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}/${nw1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}/${nw0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}/${nw1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}/${nw0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}/${nw1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}/${nw0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}/${nw1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}/${nw0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}/${nw1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}/${nw0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}/${nw1}`, normalized);
    // This is now the normalized value for this region.
    return normalized;
  };
  return normalize4;
};

let doDefragment = 'none';

const fromPolygons = (options = {}, polygons, normalize3 = createNormalize3()) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    if (polygon.length < 3) {
      // Polygon became degenerate.
      continue;
    }
    const plane = toPlane(polygon);
    if (plane === undefined) {
      // Polygon is degenerate -- probably on a line.
      continue;
    }
    // Here we use a strict plane identity to merge.
    // This may result in fragmentation.
    // const key = JSON.stringify(toPlane(polygon));
    const key = normalize4(toPlane(polygon));
    const groups = coplanarGroups.get(key);
    if (groups === undefined) {
      const group = [polygon];
      group.plane = key;
      coplanarGroups.set(key, group);
    } else {
      groups.push(polygon);
    }
  }

  // The solid is a list of surfaces, which are lists of coplanar polygons.
  const defragmented = [];

  // Possibly erase substructure and make convex.
  for (const polygons of coplanarGroups.values()) {
    let surface;
    switch (doDefragment) {
      case 'makeConvex':
        surface = makeConvex(polygons, normalize3, toPlane(polygons[0]));
        break;
      case 'retessellate':
        surface = retessellate(polygons, normalize3, toPlane(polygons[0]));
        break;
      case 'none':
      default:
        surface = polygons;
        break;
    }
    defragmented.push(surface);
  }

  return defragmented;
  // return makeWatertight(defragmented, normalize3);
};

/** Measure the bounding sphere of the given poly3
 * @param {poly3} the poly3 to measure
 * @returns computed bounding sphere; center (vec3) and radius
 */
const measureBoundingSphere = (solid) => {
  if (solid.boundingSphere === undefined) {
    const [min, max] = measureBoundingBox(solid);
    const center = scale$1(0.5, add(min, max));
    const radius = distance(center, max);
    solid.boundingSphere = [center, radius];
  }
  return solid.boundingSphere;
};

const outline = (solid, normalize) => {
  const polygons = [];
  for (const surface of solid) {
    const plane = toPlane$1(surface);
    for (const polygon of outline$1(surface)) {
      polygon.plane = plane;
      polygons.push(polygon);
    }
  }
  return polygons;
};

const reconcile = (solid, normalize = createNormalize3()) =>
  alignVertices(solid, normalize);

const toGeneric = (solid) => solid.map(surface => surface.map(polygon => polygon.map(point => [...point])));

const toOutlinedSolid = (solid, normalize) => {
  const outlines = [];
  for (const surface of solid) {
    outlines.push(outline$1(surface, normalize));
  }
  return outlines;
};

const toPoints = (solid) => {
  const points = [];
  eachPoint(point => points.push(point), solid);
  return points;
};

// Relax the coplanar arrangement into polygon soup.
const toPolygons = (solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  return polygons;
};

export { alignVertices, assertGood, canonicalize, doesNotOverlap, eachPoint, findOpenEdges, flip, fromPolygons, isWatertight, makeWatertight, measureBoundingBox, measureBoundingSphere, outline, reconcile, rotateX, rotateY, rotateZ, scale, toGeneric, toOutlinedSolid, toPoints, toPolygons, transform, translate };
