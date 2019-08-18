import { distance } from '@jsxcad/math-vec2';
import { equals } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

const EPS = 1e-5;
const X = 0;
const Y = 1;

export const isColinear = (a, b, c) => {
  const spanDistance = distance(a, c);
  const stepDistance = distance(a, b) + distance(b, c);
  const delta = Math.abs(spanDistance - stepDistance);
  return delta < EPS;
};

const normalizeZ0Polygon = (normalize2, z0Polygon) => {
  const polygon = z0Polygon.map(normalize2);
  polygon.push(polygon[0]);
  return polygon;
};

const normalizeClipping = (normalize2, clipping) => {
  const polygon = clipping.map(normalize2);
  return polygon;
};

const isDegenerateZ0Polygon = (z0Polygon) => {
  if (z0Polygon.length < 3) { return true; }
  if (isNaN(toPlane(z0Polygon)[0])) { return true; }
  return false;
};

const isDegeneratePolygon = (polygon) => {
  if (polygon.length < 4) { return true; }
  return false;
};

export const fromSurface = (normalize2, z0Surface) => {
  const polygons = [];
  for (const z0Polygon of z0Surface) {
    if (!isDegenerateZ0Polygon(z0Polygon)) {
      const polygon = normalizeZ0Polygon(normalize2, z0Polygon);
      polygon.push(polygon[0]);
      // polygon-clipping requires repeating the first point to be closed.
      polygons.push(polygon);
    } else {
      console.log(`QQ/fromSurface/Degenerate`);
    }
  }
  return polygons;
};

export const clean = (normalize2, multiPolygon) => {
  const cleanMultiPolygon = [];
  for (const polygons of multiPolygon) {
    const cleanPolygons = [];
    for (const polygon of polygons) {
      const cleanPolygon = normalizeClipping(normalize2, polygon);
      if (!isDegeneratePolygon(cleanPolygon)) {
        cleanPolygons.push(cleanPolygon);
      } else {
        console.log(`QQ/clean/degenerate`);
      }
    }
    if (cleanPolygons.length > 0) {
      cleanMultiPolygon.push(cleanPolygons);
    }
  }
  return cleanMultiPolygon;
};

export const toSurface = (normalize2, multiPolygon) => {
  const z0Surface = [];
  for (const polygons of multiPolygon) {
    for (const polygon of polygons) {
      const z0Polygon = [];
      let last;
      for (const point of polygon) {
        if (point !== last) {
          z0Polygon.push([point[X], point[Y], 0]);
          last = point;
        }
      }
      // Remove repeated last point.
      if (!equals(z0Polygon[0], z0Polygon[z0Polygon.length - 1])) {
        throw Error('die');
      }
      z0Polygon.pop();
      if (!isDegenerateZ0Polygon(z0Polygon)) {
        z0Surface.push(z0Polygon);
      } else {
        console.log(`QQ/toSurface/degenerate`);
      }
    }
  }
  return z0Surface;
};
