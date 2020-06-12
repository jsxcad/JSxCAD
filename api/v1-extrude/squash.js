import { flip, isCounterClockwise } from "@jsxcad/geometry-path";
import {
  getPaths,
  getSolids,
  getSurfaces,
  getZ0Surfaces,
} from "@jsxcad/geometry-tagged";

import Shape from "@jsxcad/api-v1-shape";
import { outline } from "@jsxcad/geometry-z0surface-boolean";
import { toPlane } from "@jsxcad/math-poly3";

export const squash = (shape) => {
  const geometry = shape.toKeptGeometry();
  const result = { layers: [] };
  for (const { solid, tags } of getSolids(geometry)) {
    const polygons = [];
    for (const surface of solid) {
      for (const path of surface) {
        const flat = path.map(([x, y]) => [x, y, 0]);
        if (toPlane(flat) === undefined) continue;
        polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
      }
    }
    result.layers.push({ z0Surface: outline(polygons), tags });
  }
  for (const { surface, tags } of getSurfaces(geometry)) {
    const polygons = [];
    for (const path of surface) {
      const flat = path.map(([x, y]) => [x, y, 0]);
      if (toPlane(flat) === undefined) continue;
      polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
    }
    result.layers.push({ z0Surface: polygons, tags });
  }
  for (const { z0Surface, tags } of getZ0Surfaces(geometry)) {
    const polygons = [];
    for (const path of z0Surface) {
      polygons.push(path);
    }
    result.layers.push({ z0Surface: polygons, tags });
  }
  for (const { paths, tags } of getPaths(geometry)) {
    const flatPaths = [];
    for (const path of paths) {
      flatPaths.push(path.map(([x, y]) => [x, y, 0]));
    }
    result.layers.push({ paths: flatPaths, tags });
  }
  return Shape.fromGeometry(result);
};

const squashMethod = function () {
  return squash(this);
};
Shape.prototype.squash = squashMethod;

export default squash;
