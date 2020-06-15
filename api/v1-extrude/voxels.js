import { Shape, assemble } from '@jsxcad/api-v1-shape';
import {
  containsPoint as containsPointAlgorithm,
  fromSolid,
} from '@jsxcad/geometry-bsp';
import { getSolids, measureBoundingBox } from '@jsxcad/geometry-tagged';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromPolygons } from '@jsxcad/geometry-solid';

const X = 0;
const Y = 1;
const Z = 2;

const floor = (value, resolution) =>
  Math.floor(value / resolution) * resolution;
const ceil = (value, resolution) => Math.ceil(value / resolution) * resolution;

const floorPoint = ([x, y, z], resolution) => [
  floor(x, resolution),
  floor(y, resolution),
  floor(z, resolution),
];
const ceilPoint = ([x, y, z], resolution) => [
  ceil(x, resolution),
  ceil(y, resolution),
  ceil(z, resolution),
];

export const voxels = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPointAlgorithm(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const polygons = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
        const state = test([x, y, z]);
        if (state !== test([x + resolution, y, z])) {
          const face = [
            [x + offset, y - offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x + offset, y - offset, z + offset],
          ];
          polygons.push(state ? face : face.reverse());
        }
        if (state !== test([x, y + resolution, z])) {
          const face = [
            [x - offset, y + offset, z - offset],
            [x + offset, y + offset, z - offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push(state ? face.reverse() : face);
        }
        if (state !== test([x, y, z + resolution])) {
          const face = [
            [x - offset, y - offset, z + offset],
            [x + offset, y - offset, z + offset],
            [x + offset, y + offset, z + offset],
            [x - offset, y + offset, z + offset],
          ];
          polygons.push(state ? face : face.reverse());
        }
      }
    }
  }
  return Shape.fromGeometry({ solid: fromPolygons({}, polygons) });
};

const voxelsMethod = function (...args) {
  return voxels(this, ...args);
};
Shape.prototype.voxels = voxelsMethod;

export const surfaceCloud = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPointAlgorithm(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const paths = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
        const state = test([x, y, z]);
        if (state !== test([x + resolution, y, z])) {
          paths.push([null, [x, y, z], [x + resolution, y, z]]);
        }
        if (state !== test([x, y + resolution, z])) {
          paths.push([null, [x, y, z], [x, y + resolution, z]]);
        }
        if (state !== test([x, y, z + resolution])) {
          paths.push([null, [x, y, z], [x, y, z + resolution]]);
        }
      }
    }
  }
  return Shape.fromGeometry({ paths });
};

const surfaceCloudMethod = function (...args) {
  return surfaceCloud(this, ...args);
};
Shape.prototype.surfaceCloud = surfaceCloudMethod;

const withSurfaceCloudMethod = function (...args) {
  return assemble(this, surfaceCloud(this, ...args));
};
Shape.prototype.withSurfaceCloud = withSurfaceCloudMethod;

const orderPoints = ([aX, aY, aZ], [bX, bY, bZ]) => {
  const dX = aX - bX;
  if (dX !== 0) {
    return dX;
  }
  const dY = aY - bY;
  if (dY !== 0) {
    return dY;
  }
  const dZ = aZ - bZ;
  return dZ;
};

export const cloud = (shape, resolution = 1) => {
  const offset = resolution / 2;
  const geometry = shape.toKeptGeometry();
  const normalize = createNormalize3();
  const [boxMin, boxMax] = measureBoundingBox(geometry);
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const classifiers = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    classifiers.push({ bsp: fromSolid(solid, normalize) });
  }
  const test = (point) => {
    for (const { bsp } of classifiers) {
      if (containsPointAlgorithm(bsp, point)) {
        return true;
      }
    }
    return false;
  };
  const points = [];
  for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
    for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
      for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
        if (test([x, y, z])) {
          points.push([x, y, z]);
        }
      }
    }
  }
  points.sort(orderPoints);
  return Shape.fromGeometry({ points });
};

const cloudMethod = function (...args) {
  return cloud(this, ...args);
};
Shape.prototype.cloud = cloudMethod;

// FIX: move this
export const containsPoint = (shape, point) => {
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const bsp = fromSolid(solid, createNormalize3());
    if (containsPointAlgorithm(bsp, point)) {
      return true;
    }
  }
  return false;
};

const containsPointMethod = function (point) {
  return containsPoint(this, point);
};
Shape.prototype.containsPoint = containsPointMethod;

export default voxels;
