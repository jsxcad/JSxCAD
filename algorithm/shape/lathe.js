import { flip, rotateX, translate } from '@jsxcad/geometry-path';

const buildWalls = (polygons, floor, roof, loopOffset) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    if (floor[start] === null || floor[end] === null) {
      continue;
    }
    // Remember that we are walking CCW.
    if (loopOffset !== 0) {
      polygons.push([floor[start], floor[end], roof[start]]);
      polygons.push([floor[end], roof[end], roof[start]]);
    } else {
      polygons.push([floor[start], floor[end], roof[end], roof[start]]);
    }
  }
};

// Rotate a path around the X axis to produce the polygons of a solid.
export const lathe = ({ sides = 5, loops = 1, loopOffset = 0 }, path) => {
  const sideRadians = Math.PI * -2 / sides;
  let lastPath;
  const stepOffset = loopOffset / sides;
  const polygons = [];
  let step = 0;
  if (loopOffset !== 0) {
    polygons.push(path);
  }
  for (let loop = 0; loop < loops; loop++) {
    for (let side = 0; side < sides; side++, step++) {
      const rotatedPath = translate([step * stepOffset, 0, 0], rotateX(sideRadians * side, path));
      if (lastPath !== undefined) {
        buildWalls(polygons, rotatedPath, lastPath, loopOffset);
      }
      lastPath = rotatedPath;
    }
  }
  const end = translate([step * stepOffset, 0, 0], path);
  if (lastPath !== undefined) {
    buildWalls(polygons, end, lastPath, loopOffset);
    if (loopOffset !== 0) {
      polygons.push(flip(end));
    }
  }
  return polygons;
};
