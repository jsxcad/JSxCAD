import { fromPoint, normalize, subtract, scale, rotateZ, add } from './jsxcad-math-vec3.js';
import { getEdges, createOpenPath, isClosed } from './jsxcad-geometry-path.js';
import { intersect as intersect$1, fromPoints } from './jsxcad-math-line2.js';
import { getNonVoidPaths } from './jsxcad-geometry-tagged.js';

const intersect = (a, b) => fromPoint(intersect$1(a, b));

const RIGHT_ANGLE = Math.PI / -2;

const makeToolLine = (start, end, radius) => {
  const direction = normalize(subtract(end, start));
  // The tool (with given radius) passes along the outside of the path.
  const toolEdgeOffset = scale(radius, rotateZ(direction, RIGHT_ANGLE));
  // And in order to get sharp angles with a circular tool we need to cut a bit further.
  const toolStart = add(start, toolEdgeOffset);
  const toolEnd = add(end, toolEdgeOffset);
  const toolLine = fromPoints(toolStart, toolEnd);
  return [toolStart, toolEnd, toolLine];
};

const toolpathEdges = (
  path,
  radius = 1,
  overcut = true,
  solid = false
) => {
  const toolpaths = [];
  let toolpath;
  let lastToolLine;
  const edges = getEdges(path);
  for (const [start, end] of edges) {
    const [toolStart, toolEnd, thisToolLine] = makeToolLine(start, end, radius);
    if (!toolpath) {
      toolpath = createOpenPath();
      toolpaths.push(toolpath);
    }
    if (overcut) {
      if (lastToolLine) {
        // Move (back) to the intersection point from the overcut.
        toolpath.push(intersect(thisToolLine, lastToolLine));
      }
      toolpath.push(toolStart, toolEnd);
    } else {
      if (lastToolLine) {
        // Replace the previous point with the intersection.
        toolpath[toolpath.length - 1] = intersect(thisToolLine, lastToolLine);
        toolpath.push(toolEnd);
      } else {
        toolpath.push(toolStart, toolEnd);
      }
    }
    lastToolLine = thisToolLine;
  }
  if (isClosed(path) && !overcut) {
    toolpath.shift();
    // Rewrite the start and end to meet at their intersection.
    const [start, end] = edges[0];
    const [, , thisToolLine] = makeToolLine(start, end, radius);
    const intersection = intersect(thisToolLine, lastToolLine);
    toolpath[0] = intersection;
    toolpath[toolpath.length - 1] = intersection;
  }
  return toolpaths;
};

const toolpath = (
  geometry,
  radius = 1,
  overcut = true,
  solid = false
) => {
  const toolpaths = [];
  for (const { paths } of getNonVoidPaths(geometry)) {
    for (const path of paths) {
      toolpaths.push(...toolpathEdges(path, radius, overcut, solid));
    }
  }
  return toolpaths;
};

export { toolpath };
