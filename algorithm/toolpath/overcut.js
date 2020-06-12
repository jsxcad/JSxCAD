import { add, normalize, rotateZ, scale, subtract } from "@jsxcad/math-vec3";
import { fromPoints, intersectPointOfLines } from "@jsxcad/math-line2";

import { getEdges } from "@jsxcad/geometry-path";
import { getPaths } from "@jsxcad/geometry-tagged";

const intersectionPoints = (cuts, overcut = 0) => {
  cuts.push(cuts[0]);
  var intersectionPointsList = [];
  var i = 0;
  while (i < cuts.length - 1) {
    const point = intersectPointOfLines(
      fromPoints(...cuts[i]),
      fromPoints(...cuts[i + 1])
    );
    point.push(cuts[i][0][2]);
    if (overcut) {
      intersectionPointsList.push(cuts[i][1]);
    }
    intersectionPointsList.push(point);
    i++;
  }
  return intersectionPointsList;
};

export const overcutPathEdges = (
  path,
  radius = 1,
  overcut = 0,
  joinPaths = false
) => {
  var cuts = [];
  for (const [start, end] of getEdges(path)) {
    const direction = normalize(subtract(start, end));
    const angleRadians = Math.PI / 2;
    const offsetDirection = rotateZ(direction, angleRadians);
    const offset = scale(radius, offsetDirection);
    const frontcut = scale(-overcut, direction);
    const backcut = scale(overcut, direction);
    const startCut = add(start, add(backcut, offset));
    const endCut = add(end, add(frontcut, offset));
    cuts.push([startCut, endCut]);
  }
  if (joinPaths) {
    cuts = [intersectionPoints(cuts, overcut)];
  }
  return cuts;
};

export const overcut = (
  geometry,
  radius = 1,
  overcut = 0,
  joinPaths = false
) => {
  const cuts = [];
  for (const { paths } of getPaths(geometry)) {
    for (const path of paths) {
      cuts.push(...overcutPathEdges(path, radius, overcut, joinPaths));
    }
  }
  return cuts;
};
