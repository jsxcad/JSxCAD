import { add, normalize, rotateZ, scale, subtract } from '@jsxcad/math-vec3';

import { getEdges } from '@jsxcad/geometry-path';
import { getNonVoidPaths } from '@jsxcad/geometry-tagged';

export const toolpathEdges = (path, radius = 1, overcut = 0, solid = false) => {
  var toolpaths = [];
  for (const [start, end] of getEdges(path)) {
    const direction = normalize(subtract(end, start));
    // The tool (with given radius) passes along the outside of the path.
    const rightAngle = Math.PI / -2;
    const orthogonalToolOffset = rotateZ(direction, rightAngle);
    const toolStart = add(start, orthogonalToolOffset);
    const toolEnd = add(end, orthogonalToolOffset);
    // And in order to get sharp angles with a circular tool we need to cut a bit further.
    const overcutOffset = scale(overcut, direction);
    if (solid) {
      // Produce a continuous path -- e.g., for milling.
      toolpaths.push([
        toolStart,
        subtract(toolStart, overcutOffset),
        add(toolEnd, overcutOffset),
        toolEnd,
      ]);
    } else {
      // Produce a discontinuous path -- e.g., for laser cutting.
      toolpaths.push([
        subtract(toolStart, overcutOffset),
        add(toolEnd, overcutOffset),
      ]);
    }
  }
  return toolpaths;
};

export const toolpath = (geometry, radius = 1, overcut, solid = false) => {
  const toolpaths = [];
  for (const { paths } of getNonVoidPaths(geometry)) {
    for (const path of paths) {
      toolpaths.push(...toolpathEdges(path, radius, overcut, solid));
    }
  }
  return toolpaths;
};
