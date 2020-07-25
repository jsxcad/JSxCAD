import { flip, rotateX, translate } from '@jsxcad/geometry-path';

import { cache } from '@jsxcad/cache';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

const buildWalls = (polygons, floor, roof) => {
  for (
    let start = floor.length - 1, end = 0;
    end < floor.length;
    start = end++
  ) {
    if (floor[start] === null || floor[end] === null) {
      continue;
    }
    // Remember that we are walking CCW.
    polygons.push([roof[start], roof[end], floor[start]]);
    polygons.push([roof[end], floor[end], floor[start]]);
  }
};

// Rotate a path around the X axis to produce the polygons of a solid.
const loopImpl = (
  path,
  endRadians = Math.PI * 2,
  resolution = 16,
  pitch = 0
) => {
  const stepRadians = (Math.PI * 2) / resolution;
  const pitchPerRadian = pitch / (Math.PI * 2);
  let lastPath;
  const polygons = [];
  if (endRadians !== Math.PI * 2 || pitch !== 0) {
    // Cap the loop.
    polygons.push(
      flip(path),
      translate([pitchPerRadian * endRadians, 0, 0], rotateX(endRadians, path))
    );
  }
  for (let radians = 0; radians < endRadians; radians += stepRadians) {
    const rotatedPath = translate(
      [pitchPerRadian * radians, 0, 0],
      rotateX(radians, path)
    );
    if (lastPath !== undefined) {
      buildWalls(polygons, rotatedPath, lastPath);
    }
    lastPath = rotatedPath;
  }
  if (lastPath !== undefined) {
    buildWalls(
      polygons,
      translate([pitchPerRadian * endRadians, 0, 0], rotateX(endRadians, path)),
      lastPath
    );
  }
  return { type: 'solid', solid: fromPolygonsToSolid(polygons) };
};

export const loop = cache(loopImpl);
