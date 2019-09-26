import { add, normalize, rotateZ, scale, subtract } from '@jsxcad/math-vec3';
import { getPaths } from '@jsxcad/geometry-tagged';

import { getEdges } from '@jsxcad/geometry-path';

export const overcutPathEdges = (path, radius = 1, overcut = 0) => {
  const cuts = [];
  for (const [start, end] of getEdges(path)) {
    const direction = normalize(subtract(start, end));
    const angleRadians = Math.PI / 2;
    const offsetDirection = rotateZ(angleRadians, [0, 0, 0], direction);
    const offset = scale(radius, offsetDirection);
    const frontcut = scale(-overcut, direction);
    const backcut = scale(overcut, direction);
    const startCut = add(start, add(backcut, offset));
    const endCut = add(end, add(frontcut, offset));
    cuts.push([startCut, endCut]);
  }
  return cuts;
};

export const overcut = (geometry, radius = 1, overcut = 0) => {
  const cuts = [];
  for (const { paths } of getPaths(geometry)) {
    for (const path of paths) {
      cuts.push(...overcutPathEdges(path, radius, overcut));
    }
  }
  return cuts;
};
