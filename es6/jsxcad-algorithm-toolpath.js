import { normalize, subtract, scale, rotateZ, add, fromPoint } from './jsxcad-math-vec3.js';
import { getEdges, isClosed, createOpenPath } from './jsxcad-geometry-path.js';
import { fromPoints, intersect as intersect$1 } from './jsxcad-math-line2.js';
import { getNonVoidPaths } from './jsxcad-geometry-tagged.js';

const intersect = (a, b) => fromPoint(intersect$1(a, b));

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
  // FIX: Avoid retracing.
  if (isClosed(path)) {
    // If the path is closed retrace the first path to make sure it's properly closed.
    edges.push(edges[0]);
  }
  for (const [start, end] of edges) {
    const direction = normalize(subtract(end, start));
    // The tool (with given radius) passes along the outside of the path.
    const rightAngle = Math.PI / -2;
    const toolEdgeOffset = scale(radius, rotateZ(direction, rightAngle));
    // And in order to get sharp angles with a circular tool we need to cut a bit further.
    const overcutOffset = scale(overcut ? 0 : -radius, direction);
    const toolStart = subtract(add(start, toolEdgeOffset), overcutOffset);
    const toolEnd = add(add(end, toolEdgeOffset), overcutOffset);
    const thisToolLine = fromPoints(toolStart, toolEnd);
    if (!toolpath) {
      toolpath = createOpenPath();
      toolpaths.push(toolpath);
    }
    if (overcut) {
      if (lastToolLine) {
        // Move (back) to the intersection point from the overcut.
        toolpath.push(intersect(thisToolLine, lastToolLine));
      }
    } else {
      if (lastToolLine) {
        // Trim the previous end point.
        toolpath.pop();
        // Replace it with the intersection.
        toolpath.push(intersect(thisToolLine, lastToolLine));
      }
    }
    toolpath.push(toolStart, toolEnd);
    lastToolLine = thisToolLine;
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
