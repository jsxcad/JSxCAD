import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { transform as transform$1, assertGood as assertGood$1, canonicalize as canonicalize$1, measureBoundingBox as measureBoundingBox$1, eachPoint as eachPoint$1, flip as flip$1, fromPolygons as fromPolygons$1, makeConvex, makeSimple, toPolygons as toPolygons$1 } from './jsxcad-geometry-surface.js';
import { createNormalize3 as createNormalize3$1 } from './jsxcad-algorithm-quantize.js';
import { deduplicate, getEdges } from './jsxcad-geometry-path.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { scale as scale$1, add, distance } from './jsxcad-math-vec3.js';

const transform = (matrix, solid) => solid.map(surface => transform$1(matrix, surface));

const rotateX = (radians, solid) => transform(fromXRotation(radians), solid);
const rotateY = (radians, solid) => transform(fromYRotation(radians), solid);
const rotateZ = (radians, solid) => transform(fromZRotation(radians), solid);
const scale = (vector, solid) => transform(fromScaling(vector), solid);
const translate = (vector, solid) => transform(fromTranslation(vector), solid);

const alignVertices = (solid, normalize3 = createNormalize3$1(1e5)) => {
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

// The resolution is 1 / multiplier.

const X = 0;
const Y = 1;
const Z = 2;

const createNormalize3 = (multiplier = 1e5) => {
  const map = new Map();
  const normalize3 = (coordinate) => {
    // Apply a spatial quantization to the 3 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nz0 = nz;
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    // const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier];
    const normalized = coordinate;
    map.set(`${nx0}/${ny0}/${nz0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize3;
};

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

const findOpenEdges = (solid, isOpen) => {
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

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;

const fromPolygons = (options = {}, rawPolygons) => {
  const normalize3 = createNormalize3$1();
  const coplanarGroups = new Map();

  const polygons = [];

  for (const polygon of rawPolygons) {
    if (polygon.length < 3) {
      continue;
    } else if (polygon.length === 3) {
      polygons.push(polygon.map(normalize3));
    } else {
      // The polygon is convex.
      // Triangulate with the center to accommodate plane popping.
      const center = [0, 0, 0];
      for (const point of polygon) {
        center[X$2] += point[X$2];
        center[Y$2] += point[Y$2];
        center[Z$2] += point[Z$2];
      }
      center[X$2] /= polygon.length;
      center[Y$2] /= polygon.length;
      center[Z$2] /= polygon.length;
      for (const [start, end] of getEdges(polygon)) {
        polygons.push([start, end, center].map(normalize3));
      }
    }
  }

  for (const polygon of polygons) {
    const plane = toPlane(polygon);
    if (plane === undefined) {
      console.log(`QQ/fromPolygons/degenerate`);
      continue;
    }
    // const key = normalize4(toPlane(polygon));
    const key = JSON.stringify(toPlane(polygon));
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
  const solid = [];

  for (const [plane, polygons] of coplanarGroups) {
    if (polygons.length === 1) {
      // A single polygon forms a valid surface.
      solid.push(polygons);
    } else {
      const surface = fromPolygons$1({ plane }, polygons);
      solid.push(surface);
    }
  }

  const alignedSolid = alignVertices(solid, normalize3);
  return alignedSolid;
};

const convexSurfaces = Symbol('convexSurfaces');

const makeSurfacesConvex = (rawSolid) => {
  if (rawSolid.length === undefined) {
    throw Error('die');
  }
  if (rawSolid[convexSurfaces] === undefined) {
    const solid = alignVertices(rawSolid);
    assertGood(solid);
    const convex = solid.map(surface => makeConvex(surface));
    rawSolid[convexSurfaces] = alignVertices(convex);
  }
  return rawSolid[convexSurfaces];
};

const makeSurfacesSimple = (options = {}, solid) => solid.map(surface => makeSimple({}, surface));

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

const toGeneric = (solid) => solid.map(surface => surface.map(polygon => polygon.map(point => [...point])));

const toPoints = (solid) => {
  const points = [];
  eachPoint(point => points.push(point), solid);
  return points;
};

// Relax the coplanar arrangement into polygon soup.
const toPolygons = (options = {}, solid) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...toPolygons$1({}, surface));
  }
  return polygons;
};

export { alignVertices, assertGood, canonicalize, createNormalize3, doesNotOverlap, eachPoint, findOpenEdges, flip, fromPolygons, makeSurfacesConvex, makeSurfacesSimple, measureBoundingBox, measureBoundingSphere, rotateX, rotateY, rotateZ, scale, toGeneric, toPoints, toPolygons, transform, translate };
