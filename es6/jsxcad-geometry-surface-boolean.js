import { difference as difference$1, intersection as intersection$1, outline as outline$1, union as union$1 } from './jsxcad-geometry-z0surface-boolean.js';
import { distance } from './jsxcad-math-vec3.js';
import { measureBoundingSphere } from './jsxcad-geometry-surface.js';
import { toPlane as toPlane$1, transform as transform$1 } from './jsxcad-math-poly3.js';
import { toXYPlaneTransforms } from './jsxcad-math-plane.js';

// The resolution is 1 / multiplier.
const multiplier = 1e5;

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// FIX: Make this efficient.
// FIX: Move to math-plane.
const equals = (a, b) => {
  const map = new Map();
  const normalize4 = (coordinate) => {
    // Apply a spatial quantization to the 4 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z] * multiplier - 0.5);
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

  if (a === undefined || b === undefined) {
    return false;
  }

  return normalize4(a) === normalize4(b);
};

const toPlane = (surface) => {
  if (surface.plane !== undefined) {
    return surface.plane;
  } else {
    for (const polygon of surface) {
      const plane = toPlane$1(polygon);
      if (plane !== undefined) {
        surface.plane = plane;
        return surface.plane;
      }
    }
  }
};

const transform = (matrix, polygons) => polygons.map(polygon => transform$1(matrix, polygon));

const mayOverlap = ([centerA, radiusA], [centerB, radiusB]) => distance(centerA, centerB) < radiusA + radiusB;

const difference = (baseSurface, ...surfaces) => {
  if (baseSurface.length === 0) {
    // Empty geometry can't get more empty.
    return [];
  }
  const baseBounds = measureBoundingSphere(baseSurface);
  surfaces = surfaces.filter(surface => surface.length > 0 &&
                                        equals(toPlane(baseSurface), toPlane(surface)) &&
                                        mayOverlap(baseBounds, measureBoundingSphere(surface)));
  if (surfaces.length === 0) {
    // Nothing to be removed.
    return baseSurface;
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(baseSurface));
  const z0Surface = transform(toZ0, baseSurface);
  const z0Surfaces = surfaces.map(surface => transform(toZ0, surface));
  const z0Difference = difference$1(z0Surface, ...z0Surfaces);
  return transform(fromZ0, z0Difference);
};

const intersection = (...surfaces) => {
  if (surfaces.length === 0) {
    return [];
  }
  for (const surface of surfaces) {
    if (surface.length === 0 || !equals(toPlane(surfaces[0]), toPlane(surface))) {
      return [];
    }
  }
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surfaces[0]));
  const z0Surface = intersection$1(...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};

const outline = (surface) => {
  // FIX: Detect when the surfaces aren't in the same plane.
  const [toZ0, fromZ0] = toXYPlaneTransforms(toPlane(surface));
  const z0Surface = transform(toZ0, surface);
  const outlinedZ0Surface = outline$1(z0Surface);
  return transform(fromZ0, outlinedZ0Surface);
};

const union = (...surfaces) => {
  // Trim initial empty surfaces.
  while (surfaces.length > 0 && surfaces[0].length === 0) {
    surfaces.shift();
  }
  if (surfaces.length === 0) {
    return [];
  }
  // (But then, are these really the right semantics?)
  const baseSurface = surfaces.shift();
  const basePlane = toPlane(baseSurface);
  surfaces = surfaces.filter(surface => surface.length >= 1 &&
                             (equals(toPlane(baseSurface), toPlane(surface))));
  if (surfaces.length === 0) {
    return baseSurface;
  }
  const [toZ0, fromZ0] = toXYPlaneTransforms(basePlane);
  const z0Surface = union$1(transform(toZ0, baseSurface),
                                    ...surfaces.map(surface => transform(toZ0, surface)));
  return transform(fromZ0, z0Surface);
};

export { difference, intersection, outline, union };
