import { fromTranslation } from './jsxcad-math-mat4.js';
import { transform as transform$1, canonicalize as canonicalize$1, max, min } from './jsxcad-math-vec3.js';

const transform = (matrix, points) => points.map(point => transform$1(matrix, point));
const translate = ([x = 0, y = 0, z = 0], points) => transform(fromTranslation([x, y, z]), points);

const canonicalize = (points) => points.map(canonicalize$1);

const eachPoint = (thunk, points) => {
  for (const point of points) {
    thunk(point);
  }
};

const fromPolygons = (options = {}, polygons) => {
  const points = [];
  for (const polygon of polygons) {
    for (const point of polygon) {
      points.push(point);
    }
  }
  return points;
};

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = (points) => {
  let max$1 = points[0];
  let min$1 = points[0];
  eachPoint(point => {
    max$1 = max(max$1, point);
    min$1 = min(min$1, point);
  },
            points);
  return [min$1, max$1];
};

const union = (...geometries) => [].concat(...geometries);

const flip = (points) => points;

export { canonicalize, eachPoint, flip, fromPolygons, measureBoundingBox, transform, translate, union };
