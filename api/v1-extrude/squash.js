import { flip, isCounterClockwise } from '@jsxcad/geometry-path';
import {
  getPaths,
  getSolids,
  getSurfaces,
  getZ0Surfaces,
  taggedLayers,
  taggedPaths,
  taggedZ0Surface,
  union,
} from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';

import { toPlane } from '@jsxcad/math-poly3';

export const squash = (shape) => {
  const geometry = shape.toKeptGeometry();
  const result = taggedLayers({});
  for (const { solid, tags } of getSolids(geometry)) {
    const polygons = [];
    for (const surface of solid) {
      for (const path of surface) {
        const flat = path.map(([x, y]) => [x, y, 0]);
        if (toPlane(flat) === undefined) continue;
        polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
      }
    }
    result.content.push(
      union(...polygons.map((polygon) => taggedZ0Surface({ tags }, [polygon])))
    );
  }
  for (const { surface, tags } of getSurfaces(geometry)) {
    const polygons = [];
    for (const path of surface) {
      const flat = path.map(([x, y]) => [x, y, 0]);
      if (toPlane(flat) === undefined) continue;
      polygons.push(isCounterClockwise(flat) ? flat : flip(flat));
    }
    result.content.push(taggedZ0Surface({ tags }, polygons));
  }
  for (const { z0Surface, tags } of getZ0Surfaces(geometry)) {
    const polygons = [];
    for (const path of z0Surface) {
      polygons.push(path);
    }
    result.content.push(taggedZ0Surface({ tags }, polygons));
  }
  for (const { paths, tags } of getPaths(geometry)) {
    const flatPaths = [];
    for (const path of paths) {
      flatPaths.push(path.map(([x, y]) => [x, y, 0]));
    }
    result.content.push({ type: 'paths', paths: flatPaths, tags });
    result.content.push(taggedPaths({ tags }, flatPaths));
  }
  return Shape.fromGeometry(result);
};

const squashMethod = function () {
  return squash(this);
};
Shape.prototype.squash = squashMethod;

export default squash;
