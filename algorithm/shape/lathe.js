import { rotateX } from '@jsxcad/geometry-path';

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    if (floor[start] === null || floor[end] === null) {
      continue;
    }
    // Remember that we are walking CCW.
    polygons.push([floor[start], floor[end], roof[end], roof[start]]);
  }
};

// Rotate a path around the X axis to produce the polygons of a solid.
export const lathe = ({ sides = 5 }, path) => {
  const sideRadians = Math.PI * -2 / sides;
  let lastPath;
  const polygons = [];
  for (let side = 0; side <= sides; side++) {
    const rotatedPath = rotateX(sideRadians * side, path);
    if (lastPath !== undefined) {
      buildWalls(polygons, rotatedPath, lastPath);
    }
    lastPath = rotatedPath;
  }
  polygons.isConvex = true;
  return polygons;
};
