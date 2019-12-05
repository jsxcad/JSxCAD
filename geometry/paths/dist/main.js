import { fromScaling, fromTranslation } from './jsxcad-math-mat4.js';
import { canonicalize as canonicalize$1, flip as flip$1, toGeneric as toGeneric$1, toPolygon, toZ0Polygon, transform as transform$1 } from './jsxcad-geometry-path.js';
import { fromPoint, min, max } from './jsxcad-math-vec3.js';

const butLast = (paths) => paths.slice(0, paths.length - 1);

const canonicalize = (paths) => {
  let canonicalized = paths.map(canonicalize$1);
  if (paths.properties !== undefined) {
    // Transfer properties.
    canonicalized.properties = paths.properties;
  }
  return canonicalized;
};

// FIX: Determine the correct behaviour here.

const difference = (pathset, ...pathsets) => pathset;

const eachPoint = (options = {}, thunk, paths) => {
  for (const path of paths) {
    for (const point of path) {
      if (point !== null) {
        thunk(point);
      }
    }
  }
};

const flip = (paths) => paths.map(flip$1);

const intersection = (...pathsets) => { throw Error('Not implemented'); };

const last = (paths) => paths.length >= 1 ? paths[paths.length - 1] : [null];

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (paths) => {
  let minPoint;
  let maxPoint;
  eachPoint({},
            point => {
              minPoint = (minPoint === undefined) ? fromPoint(point) : min(minPoint, fromPoint(point));
              maxPoint = (maxPoint === undefined) ? fromPoint(point) : max(maxPoint, fromPoint(point));
            },
            paths);
  return [minPoint, maxPoint];
};

/**
 * Transforms each path of Paths.
 *
 * @param {Paths} original - the Paths to transform.
 * @param {Function} [transform=identity] - function used to transform the paths.
 * @returns {Paths} the transformed paths.
 */
const map = (original, transform) => {
  if (original === undefined) {
    original = [];
  }
  if (transform === undefined) {
    transform = _ => _;
  }
  // FIX: Consider optimizing this to return the original if all transforms are identity transforms.
  return original.map(path => transform(path));
};

const toGeneric = (paths) => map(paths, toGeneric$1);

const toPoints = (options = {}, paths) => {
  const points = [];
  eachPoint(options, point => points.push(point), paths);
  return points;
};

const toPolygons = (paths) => {
  if (paths.isPolygons !== true) {
    paths = map(paths, toPolygon);
    paths.isPolygons = true;
  }
  return paths;
};

const toZ0Polygons = (paths) => {
  if (paths.isZ0Polygons !== true) {
    paths = map(paths, toZ0Polygon);
    paths.isZ0Polygons = true;
  }
  return paths;
};

const transform = (matrix, paths) => paths.map(path => transform$1(matrix, path));

// FIX: Deduplication.

const union = (...pathsets) => [].concat(...pathsets);

const scale = ([x = 1, y = 1, z = 1], paths) => transform(fromScaling([x, y, z]), paths);
const translate = ([x = 0, y = 0, z = 0], paths) => transform(fromTranslation([x, y, z]), paths);

export { butLast, canonicalize, difference, eachPoint, flip, intersection, last, measureBoundingBox, scale, toGeneric, toPoints, toPolygons, toZ0Polygons, transform, translate, union };
