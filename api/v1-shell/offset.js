import {
  add,
  equals,
  normalize,
  scale,
  squaredDistance,
  subtract,
  transform,
} from '@jsxcad/math-vec3';
import {
  getNonVoidPaths,
  taggedAssembly,
  taggedPaths,
} from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';
import { fromPolygon as fromPolygonToPlane } from '@jsxcad/math-plane';
import { fromRotation } from '@jsxcad/math-mat4';
import { getEdges } from '@jsxcad/geometry-path';
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
    for (let j = i + 2; j < path.length; j++) {
      if (mod(j + 1, path.length) === i) {
        continue;
      }
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
        console.log(`QQ: i=${i} j=${j} l=${path.length}`);
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
  const path = getMinimumVertexPath(input);
  const selfIntersections = getSelfIntersections(path);
  console.log(
    `QQ/selfIntersections: ${JSON.stringify([...selfIntersections.entries()])}`
  );
  const start = 0;
  let current = start;
  let from = current;
  const simplePath = [];
  do {
    console.log(`current: ${current} from: ${from}`);
    simplePath.push(path[current]);
    const intersections = selfIntersections.get(current);
    // Find where we intersected it, and proceed to the next one.
    if (intersections !== undefined) {
      if (from === current) {
        // The first intersection.
        simplePath.push(intersections[0].vertex);
        from = current;
        current = intersections[0].to;
      } else {
        let found = false;
        for (let nth = 0; nth < intersections.length; nth++) {
          console.log(`QQ/from-vs-from: ${intersections[nth].from}, ${from}`);
          if (intersections[nth].from === from) {
            simplePath.push(intersections[nth + 1].vertex);
            from = current;
            current = intersections[nth + 1].to;
            found = true;
            break;
          }
        }
        if (!found) {
          throw Error(
            `Can't find junction ${from} in ${JSON.stringify(intersections)}`
          );
        }
      }
    } else {
      current = (current + 1) % path.length;
      from = current;
    }
  } while (current !== start);
  console.log(`QQ/simplePath: ${JSON.stringify(simplePath)}`);
  resolved.push(simplePath);
};

export const offset = (shape, radius = 1, resolution = 16) => {
  const offsetPathsets = [];
  for (const { tags, paths } of getNonVoidPaths(shape.toDisjointGeometry())) {
    const resolved = [];
    for (const path of paths) {
      // Let's assume this path has a coherent plane.
      const plane = fromPolygonToPlane(path);
      const rotate90 = fromRotation(Math.PI / -2, plane);
      const getDirection = (start, end) => normalize(subtract(end, start));
      const getOffset = ([start, end]) => {
        const direction = getDirection(start, end);
        const offset = transform(rotate90, scale(radius, direction));
        return [add(start, offset), add(end, offset)];
      };

      const offsetPath = [];
      const edges = getEdges(path).filter(
        ([start, end]) => !equals(start, end)
      );
      let lastOffset;
      for (const edge of edges) {
        const offset = getOffset(edge);
        console.log(`QQ/offset: ${JSON.stringify(offset)}`);
        console.log(`QQ/lastOffset: ${JSON.stringify(lastOffset)}`);
        if (lastOffset) {
          const [from] = intersect(lastOffset, offset);
          if (from === null) {
            console.log(`QQ/no intersection`);
            console.log(`QQ/lastOffset: ${JSON.stringify(lastOffset)}`);
            console.log(`QQ/offset: ${JSON.stringify(offset)}`);
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
      console.log(offsetPath);
      resolveSelfIntersections(offsetPath, plane, resolved);
    }
    offsetPathsets.push(taggedPaths({ tags }, resolved));
  }
  console.log(`QQ/resolved: ${offsetPathsets.length}`);
  return Shape.fromGeometry(taggedAssembly({}, ...offsetPathsets));
};

const offsetMethod = function (radius, resolution) {
  return offset(this, radius, resolution);
};
Shape.prototype.offset = offsetMethod;

export default offset;
