import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { transform as transform$1, assertGood as assertGood$1, canonicalize as canonicalize$1, measureBoundingBox as measureBoundingBox$1, eachPoint as eachPoint$1, flip as flip$1, fromPolygons as fromPolygons$1, makeConvex, makeSimple, toPolygons as toPolygons$1 } from './jsxcad-geometry-surface.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
export { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { deduplicate, getEdges } from './jsxcad-geometry-path.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { scale as scale$1, add, distance } from './jsxcad-math-vec3.js';

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
const X = 0;
const Y = 1;
const Z = 2;

// Tolerates overlap up to one iota.
const doesNotOverlap = (a, b) => {
  if (a.length === 0 || b.length === 0) {
    return true;
  }
  const [minA, maxA] = measureBoundingBox(a);
  const [minB, maxB] = measureBoundingBox(b);
  if (maxA[X] <= minB[X] + iota) { return true; }
  if (maxA[Y] <= minB[Y] + iota) { return true; }
  if (maxA[Z] <= minB[Z] + iota) { return true; }
  if (maxB[X] <= minA[X] + iota) { return true; }
  if (maxB[Y] <= minA[Y] + iota) { return true; }
  if (maxB[Z] <= minA[Z] + iota) { return true; }
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

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;
const W = 3;

const createNormalize4 = () => {
  const map = new Map();
  const normalize4 = (coordinate) => {
    // Apply a spatial quantization to the 4 dimensional coordinate.
    const nx = Math.floor(coordinate[X$1] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y$1] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z$1] * multiplier - 0.5);
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

const fromPolygons = (options = {}, polygons) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    if (polygon.length < 3) {
      // Polygon became degenerate.
      continue;
    }
    const plane = toPlane(polygon);
    if (plane === undefined) {
      console.log(`QQ/fromPolygons/degenerate`);
      continue;
    }
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

  const alignedSolid = alignVertices(solid);
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

export { alignVertices, assertGood, canonicalize, doesNotOverlap, eachPoint, findOpenEdges, flip, fromPolygons, makeSurfacesConvex, makeSurfacesSimple, measureBoundingBox, measureBoundingSphere, rotateX, rotateY, rotateZ, scale, toGeneric, toPoints, toPolygons, transform, translate };
