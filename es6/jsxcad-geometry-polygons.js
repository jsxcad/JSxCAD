import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { canonicalize as canonicalize$1, flip as flip$1, fromPoints, map as map$1, toPlane, transform as transform$1 } from './jsxcad-math-poly3.js';
import { equals, max, min, scale as scale$1, add, distance } from './jsxcad-math-vec3.js';
import { isClosed } from './jsxcad-geometry-path.js';

const isDegenerate = (polygon) => {
  for (let nth = 0; nth < polygon.length; nth++) {
    if (equals(polygon[nth], polygon[(nth + 1) % polygon.length])) {
      return true;
    }
  }
  return false;
};

const canonicalize = (polygons) => {
  const canonicalized = [];
  for (let polygon of polygons) {
    polygon = canonicalize$1(polygon);
    if (!isDegenerate(polygon)) {
      canonicalized.push(polygon);
    }
  }
  return canonicalized;
};

const eachPoint = (options = {}, thunk, polygons) => {
  for (const polygon of polygons) {
    for (const point of polygon) {
      thunk(point);
    }
  }
};

/**
 * Transforms each polygon of Polygons.
 *
 * @param {Polygons} original - the Polygons to transform.
 * @param {Function} [transform=identity] - function used to transform the polygons.
 * @returns {Polygons} a copy with transformed polygons.
 */
const map = (original, transform) => {
  if (original === undefined) {
    original = [];
  }
  if (transform === undefined) {
    transform = _ => _;
  }
  return original.map(polygon => transform(polygon));
};

const flip = (polygons) => map(polygons, flip$1);

const fromPointsAndPaths = ({ points = [], paths = [] }) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push(fromPoints(path.map(nth => points[nth])));
  }
  return polygons;
};

const isTriangle = (path) => isClosed(path) && path.length === 3;

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (polygons) => {
  let max$1 = polygons[0][0];
  let min$1 = polygons[0][0];
  eachPoint({},
            point => {
              max$1 = max(max$1, point);
              min$1 = min(min$1, point);
            },
            polygons);
  return [min$1, max$1];
};

/** Measure the bounding sphere of the given poly3
 * @param {poly3} the poly3 to measure
 * @returns computed bounding sphere; center (vec3) and radius
 */
const measureBoundingSphere = (polygons) => {
  if (polygons.boundingSphere === undefined) {
    const [min, max] = measureBoundingBox(polygons);
    const center = scale$1(0.5, add(min, max));
    const radius = distance(center, max);
    polygons.boundingSphere = [center, radius];
  }
  return polygons.boundingSphere;
};

const toGeneric = (polygons) => map(polygons, map$1);

const toPoints = (options = {}, polygons) => {
  const points = [];
  eachPoint(options, point => points.push(point), polygons);
  return points;
};

const blessAsTriangles = (paths) => { paths.isTriangles = true; return paths; };

const toTriangles = (options = {}, paths) => {
  if (paths.isTriangles) {
    return paths;
  }
  const triangles = [];
  for (const path of paths) {
    const a = path[0];
    for (let nth = 2; nth < path.length; nth++) {
      const b = path[nth - 1];
      const c = path[nth];
      if (equals(a, b) || equals(a, c) || equals(b, c)) {
        // Skip degenerate triangles introduced by colinear points.
        continue;
      }
      const triangle = [a, b, c];
      if (!toPlane(triangle)) {
        // FIX: Why isn't this degeneracy detected above?
        // Skip degenerate triangles introduced by colinear points.
        continue;
      }
      triangles.push([a, b, c]);
    }
  }
  return blessAsTriangles(triangles);
};

const transform = (matrix, polygons) => polygons.map(polygon => transform$1(matrix, polygon));

const rotateX = (angle, polygons) => transform(fromXRotation(angle), polygons);
const rotateY = (angle, polygons) => transform(fromYRotation(angle), polygons);
const rotateZ = (angle, polygons) => transform(fromZRotation(angle), polygons);
const scale = (vector, polygons) => transform(fromScaling(vector), polygons);
const translate = (vector, polygons) => transform(fromTranslation(vector), polygons);

export { canonicalize, eachPoint, flip, fromPointsAndPaths, isTriangle, map, measureBoundingBox, measureBoundingSphere, rotateX, rotateY, rotateZ, scale, toGeneric, toPoints, toTriangles, transform, translate };
