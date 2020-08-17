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
import { getNonVoidPaths, taggedAssembly, taggedPaths } from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';
import { fromPolygon as fromPolygonToPlane } from '@jsxcad/math-plane';
import { fromRotation } from '@jsxcad/math-mat4';
import { getEdges } from '@jsxcad/geometry-path';
import { closestSegmentBetweenLines as intersect } from '@jsxcad/math-line3';

const INTERSECTION_THRESHOLD = 1e-5;

const START = 0;
const END = 1;

const resolveSelfIntersections = (path, plane, resolved) => {
  resolved.push(path);
  return;
  const todo = [path];
  let n = 0;
  while (todo.length > 0) {
    const walk = (path) => {
      const planeOfPath = fromPolygonToPlane(path);
      if (planeOfPath === undefined) {
        return;
      }
      const at = (nth) => path[nth % path.length];
console.log(`QQ/walk: ${path.length} ${n++} ${todo.length}`);
      // FIX: Use an appropriate spatial decomposition.
      for (let i = 0; i < path.length; i++) {
        const iStart = at(i);
        const iEnd = at(i + 1);
        for (let j = i + 2; j < path.length; j++) {
          if ((j + 1) % path.length === i) {
            continue;
          }
          const jStart = at(j);
          const jEnd = at(j + 1);
          const [from, to] = intersect([iStart, iEnd], [jStart, jEnd]);
          if (from === null || to === null) {
            continue;
          }
          if (squaredDistance(from, to) < INTERSECTION_THRESHOLD) {
            console.log(`QQ: i=${i} j=${j} l=${path.length}`);
            // We've found a self-intersection.
            // Chop the loop.
            if (i < j) {
              // [a, b, c, d@i, e, f, g@j, h, i]
              // to
              // [e, f, g, to]
              // [a, b, c, d, from, h, i]
              todo.push([...path.slice(i + 1, j + 1), to]);
              todo.push([...path.slice(j + 1), ...path.slice(0, i + 1), from]);
              return;
            } else {
              todo.push([...path.slice(j + 1, i + 1), to]);
              todo.push([...path.slice(i + 1), ...path.slice(0, j + 1), from]);
              return;
            }
          }
        }
      }
      // no self-intersections, this path is done.
      if (dot(plane, planeOfPath) > 0) {
        resolved.push(path);
      }
    };
    walk(todo.pop());
  }
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
      const edges = getEdges(path).filter(([start, end]) => !equals(start, end));
      let lastOffset;
      for (const edge of edges) {
        const offset = getOffset(edge);
console.log(`QQ/offset: ${JSON.stringify(offset)}`);
console.log(`QQ/lastOffset: ${JSON.stringify(lastOffset)}`);
        if (lastOffset) {
          const [from, to] = intersect(lastOffset, offset);
console.log(`QQ/from: ${JSON.stringify(from)}`);
console.log(`QQ/to: ${JSON.stringify(to)}`);
          if (from === null) {
console.log(`QQ/no intersection`);
console.log(`QQ/offset: ${JSON.stringify(offset)}`);
console.log(`QQ/lastOffset: ${JSON.stringify(lastOffset)}`);
            // This segment is colinear with the last, overwrite it.
            offsetPath.pop();
          } else {
            // Rewrite the previous point to be the intersection.
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
