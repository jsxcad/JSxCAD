import {
  add,
  dot,
  equals,
  normalize,
  scale,
  squaredDistance,
  subtract,
  transform,
} from '@jsxcad/math-vec3';
import { deduplicate, getEdges } from '@jsxcad/geometry-path';
import {
  getNonVoidPaths,
  taggedAssembly,
  taggedPaths,
} from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromPolygon as fromPolygonToPlane } from '@jsxcad/math-plane';
import { fromRotation } from '@jsxcad/math-mat4';
import { closestSegmentBetweenLines as intersect } from '@jsxcad/math-line3';

const INTERSECTION_THRESHOLD = 1e-5;

const X = 0;
const Y = 1;
const Z = 2;

const START = 0;
const END = 1;

const mod = (n, m) => ((n % m) + m) % m;

const getMinimumVertex = (path) => {
  let minimum = 0;
  for (let nth = 0; nth < path.length; nth++) {
    if (
      path[minimum][X] < path[nth][X] &&
      path[minimum][Y] < path[nth][Y] &&
      path[minimum][Z] < path[nth][Z]
    ) {
      minimum = nth;
    }
  }
  return minimum;
};

// This means that the path starts on an extreme convexity which must be on the
// final outer ring.
const getMinimumVertexPath = (path) => {
  const minimumVertex = getMinimumVertex(path);
  // Just rotate the path around so that it starts on the minimum vertex.
  return [...path.slice(minimumVertex), ...path.slice(0, minimumVertex)];
};

const getSelfIntersections = (path) => {
  /** Sort intersections by distance from the point. */
  const orderIntersections = (i) => {
    const point = path[i];
    return (a, b) =>
      squaredDistance(a.vertex, point) - squaredDistance(b.vertex, point);
  };
  const planeOfPath = fromPolygonToPlane(path);
  if (planeOfPath === undefined) {
    return new Map();
  }
  const at = (nth) => mod(nth, path.length);
  const intersections = new Map();
  const addIntersection = (on, from, to, vertex) => {
    if (!intersections.has(on)) {
      intersections.set(on, []);
    }
    const intersection = intersections.get(on);
    intersection.push({ from, to, vertex });
  };
  for (let i = 0; i < path.length; i++) {
    const iStart = path[at(i)];
    const iEnd = path[at(i + 1)];
    for (let j = i + 1; j < path.length; j++) {
      const jStart = path[at(j)];
      const jEnd = path[at(j + 1)];
      const [from, to, mua, mub] = intersect([iStart, iEnd], [jStart, jEnd]);
      if (
        from === null ||
        to === null ||
        mua < 0 ||
        mua > 1 ||
        mub < 0 ||
        mub > 1
      ) {
        continue;
      }
      if (squaredDistance(from, to) < INTERSECTION_THRESHOLD) {
        // We've found a self-intersection.
        addIntersection(i, at(j), at(j + 1), from);
        addIntersection(j, at(i), at(i + 1), to);
      }
    }
  }
  for (const [i, p] of intersections.entries()) {
    p.sort(orderIntersections(i));
  }
  return intersections;
};

// Instead of doing this, let's just walk around the loop starting at the minimum vertex and following each intersection skip as we go, until we get back to the start.
// This should produce an outer loop.
// For each intersection, we also queue the path we didn't follow, and then repeat for it.

const resolveSelfIntersections = (input, plane, resolved) => {
  // resolved.push(input); return;
  const path = getMinimumVertexPath(input);
  const selfIntersections = getSelfIntersections(path);
  const todo = [{ from: path.length - 1, current: 0, vertex: path[0] }];
  const scheduled = [];
  while (todo.length > 0) {
    // What makes this a bit tricky is that we may stop on a pseudo-vertex.
    let { from, current, vertex } = todo.pop();
    const simplePath = [vertex];
    const isLoop = () =>
      simplePath.length >= 2 &&
      equals(simplePath[0], simplePath[simplePath.length - 1]) &&
      !equals(
        simplePath[simplePath.length - 2],
        simplePath[simplePath.length - 1]
      );
    const walk = () => {
      while (true) {
        const intersections = selfIntersections.get(current);
        // Find where we intersected it, and proceed to the next one.
        if (intersections !== undefined) {
          let found = false;
          for (let nth = 0; nth < intersections.length; nth++) {
            if (intersections[nth].from === from) {
              const enter = intersections[nth];
              // We entered on that intersection.
              // FIX: This may have problems with touching corners.
              simplePath.push(enter.vertex);
              if (isLoop()) {
                simplePath.pop();
                return;
              }
              const exit = intersections[nth + 1];
              if (exit) {
                // We left on this intersection.
                simplePath.push(exit.vertex);
                if (isLoop()) {
                  simplePath.pop();
                  return;
                }
                // Schedule the path not taken for later traversal.
                if (
                  !scheduled.some(
                    (entry) => entry.current === current && entry.from === from
                  )
                ) {
                  todo.push({
                    current: current,
                    from: exit.from,
                    vertex: exit.vertex,
                  });
                  scheduled.push({ current, from });
                }
                // And we were traveling along the exit path when we left.
                from = current;
                current = exit.from;
              } else {
                // We walked to the next vertex.
                from = current;
                current = (current + 1) % path.length;
              }
              found = true;
              break;
            }
          }
          if (!found) {
            throw Error(
              `Current ${current} Can't find from ${from} in ${JSON.stringify(
                intersections
              )}`
            );
          }
        } else {
          current = (current + 1) % path.length;
          from = current;
        }
      }
    };
    walk();
    if (dot(plane, fromPolygonToPlane(simplePath)) > 0) {
      // Keep the paths that have not changed orientation.
      resolved.push(simplePath);
    }
  }
};

export const offset = (shape, amount = 1) => {
  const normalize3 = createNormalize3();
  const offsetPathsets = [];
  for (const { tags, paths } of getNonVoidPaths(shape.toDisjointGeometry())) {
    const resolved = [];
    for (const rawPath of paths) {
      const path = deduplicate(rawPath.map(normalize3));
      // Let's assume this path has a coherent plane.
      const plane = fromPolygonToPlane(path);
      const rotate90 = fromRotation(Math.PI / -2, plane);
      const getDirection = (start, end) => normalize(subtract(end, start));
      const getOffset = ([start, end]) => {
        const direction = getDirection(start, end);
        const offset = scale(amount, transform(rotate90, direction));
        return [add(start, offset), add(end, offset)];
      };
      const offsetPath = [];
      const edges = getEdges(path).filter(
        ([start, end]) => !equals(start, end)
      );
      let lastOffset;
      for (const edge of edges) {
        const offset = getOffset(edge);
        if (lastOffset) {
          const [from] = intersect(lastOffset, offset);
          if (from === null) {
            // This segment is colinear with the last, overwrite it.
            offsetPath.pop();
          } else {
            // Rewrite the previous end point to be the intersection.
            offsetPath.pop();
            offsetPath.push(from);
          }
          offsetPath.push(offset[END]);
        } else {
          offsetPath.push(offset[START], offset[END]);
        }
        lastOffset = offset;
      }

      // Update the initial start point, now that we know where the last is.
      if (lastOffset) {
        const offset = getOffset(edges[0]);
        const [from] = intersect(lastOffset, offset);
        if (from !== null) {
          offsetPath.pop();
          offsetPath[0] = from;
        }
      }
      resolveSelfIntersections(offsetPath, plane, resolved);
    }
    offsetPathsets.push(taggedPaths({ tags }, resolved));
  }
  return Shape.fromGeometry(taggedAssembly({}, ...offsetPathsets));
};

const offsetMethod = function (amount) {
  return offset(this, amount);
};
Shape.prototype.offset = offsetMethod;

export default offset;
