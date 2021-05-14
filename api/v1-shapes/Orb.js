import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { deduplicate, flip, scale, translate } from '@jsxcad/geometry-path';

import {
  getAt,
  getFrom,
  getMatrix,
  getScale,
  getSides,
  getTo,
} from './Plan.js';

import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import { fromAngleRadians } from '@jsxcad/math-vec2';
import { negate } from '@jsxcad/math-vec3';

const buildRegularPolygon = (sides = 32) => {
  let points = [];
  for (let i = 0; i < sides; i++) {
    let radians = (2 * Math.PI * i) / sides;
    let [x, y] = fromAngleRadians(radians);
    points.push([x, y, 0]);
  }
  return points;
};

const buildWalls = (polygons, floor, roof) => {
  for (
    let start = floor.length - 1, end = 0;
    end < floor.length;
    start = end++
  ) {
    // Remember that we are walking CCW.
    polygons.push({
      points: deduplicate([floor[start], floor[end], roof[end], roof[start]]),
    });
  }
};

// Approximates a UV sphere.
const buildRingSphere = (resolution = 20) => {
  /** @type {Polygon[]} */
  const polygons = [];
  let lastPath;

  const latitudinalResolution = 2 + resolution;
  const longitudinalResolution = 2 * latitudinalResolution;

  // Trace out latitudinal rings.
  const ring = buildRegularPolygon(longitudinalResolution);
  let path;
  const getEffectiveSlice = (slice) => {
    if (slice === 0) {
      return 0.5;
    } else if (slice === latitudinalResolution) {
      return latitudinalResolution - 0.5;
    } else {
      return slice;
    }
  };
  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    const angle =
      (Math.PI * 1.0 * getEffectiveSlice(slice)) / latitudinalResolution;
    const height = Math.cos(angle);
    const radius = Math.sin(angle);
    const points = ring;
    const scaledPath = scale([radius, radius, radius], points);
    const translatedPath = translate([0, 0, height], scaledPath);
    path = translatedPath;
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      polygons.push({ points: path });
    }
    lastPath = path;
  }
  if (path) {
    polygons.push({ points: flip(path) });
  }
  return polygons;
};

registerReifier('Orb', ({ tags, plan }) => {
  const [scale, middle] = getScale(plan);
  return Shape.fromPolygons(buildRingSphere(getSides(plan, 16)))
    .scale(...scale)
    .move(...middle)
    .orient({
      center: negate(getAt(plan)),
      from: getFrom(plan),
      at: getTo(plan),
    })
    .transform(getMatrix(plan))
    .setTags(tags)
    .toGeometry();
});

export const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Orb' })).diameter(x, y, z);

Shape.prototype.Orb = shapeMethod(Orb);

export default Orb;
