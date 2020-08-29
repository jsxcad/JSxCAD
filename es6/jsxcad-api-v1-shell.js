import { add, subtract, normalize, dot, transform, scale, equals, squaredDistance } from './jsxcad-math-vec3.js';
import { getNonVoidSolids, getAnyNonVoidSurfaces, taggedSurface, union, taggedAssembly, getSolids, taggedLayers, getNonVoidPaths, taggedPaths } from './jsxcad-geometry-tagged.js';
import { Hull } from './jsxcad-api-v1-extrude.js';
import Shape$1, { Shape } from './jsxcad-api-v1-shape.js';
import { Sphere } from './jsxcad-api-v1-shapes.js';
import { createNormalize3 } from './jsxcad-algorithm-quantize.js';
import { fromRotation } from './jsxcad-math-mat4.js';
import { getEdges, deduplicate } from './jsxcad-geometry-path.js';
import { closestSegmentBetweenLines } from './jsxcad-math-line3.js';
import { outlineSurface } from './jsxcad-geometry-halfedge.js';
import { toPlane } from './jsxcad-geometry-surface.js';
import { toConvexClouds, fromSolid } from './jsxcad-geometry-bsp.js';
import { fromPolygon } from './jsxcad-math-plane.js';

/**
 *
 * # Shell
 *
 * Converts a solid into a hollow shell of a given thickness.
 *
 * ::: illustration
 * ```
 * Cube(10).shell(1);
 * ```
 * :::
 *
 **/

const START = 0;
const END = 1;

const Shell = (radius = 1, resolution = 3, ...shapes) => {
  const normalize3 = createNormalize3();
  resolution = Math.max(resolution, 3);
  const pieces = [];
  for (const shape of shapes) {
    for (const { solid, tags = [] } of getNonVoidSolids(
      shape.toDisjointGeometry()
    )) {
      for (const surface of solid) {
        for (const polygon of surface) {
          pieces.push(
            Hull(
              ...polygon.map((point) =>
                Sphere(radius, { resolution }).move(...point)
              )
            )
              .setTags(tags)
              .toGeometry()
          );
        }
      }
    }
    // FIX: This is more expensive than necessary.
    const surfaces = [];
    for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
      shape.toDisjointGeometry()
    )) {
      const thisSurface = surface || z0Surface;
      const plane = toPlane(thisSurface);
      const rotate90 = fromRotation(Math.PI / -2, plane);
      const getDirection = (start, end) => normalize(subtract(end, start));
      const getOffset = ([start, end]) => {
        const direction = getDirection(start, end);
        const offset = transform(rotate90, scale(radius, direction));
        return offset;
      };
      const getOuter = (offset, [start, end]) => [
        add(start, offset),
        add(end, offset),
      ];
      const getInner = (offset, [start, end]) => [
        subtract(start, offset),
        subtract(end, offset),
      ];
      for (const path of outlineSurface(thisSurface, normalize3)) {
        const edges = getEdges(path);
        let last = edges[edges.length - 2];
        let current = edges[edges.length - 1];
        let next = edges[0];
        for (
          let nth = 0;
          nth < edges.length;
          last = current, current = next, next = edges[++nth]
        ) {
          const lastOffset = getOffset(last);
          const currentOffset = getOffset(current);
          const nextOffset = getOffset(next);
          const lastOuter = getOuter(lastOffset, last);
          const lastInner = getInner(lastOffset, last);
          const currentOuter = getOuter(currentOffset, current);
          const currentInner = getInner(currentOffset, current);
          const nextOuter = getOuter(nextOffset, next);
          const nextInner = getInner(nextOffset, next);
          // FIX: The projected offsets can cross.
          const startOuter =
            closestSegmentBetweenLines(lastOuter, currentOuter)[END] ?? currentOuter[START];
          const endOuter =
            closestSegmentBetweenLines(currentOuter, nextOuter)[START] ?? currentOuter[END];
          const startInner =
            closestSegmentBetweenLines(lastInner, currentInner)[END] ?? currentInner[START];
          const endInner =
            closestSegmentBetweenLines(currentInner, nextInner)[START] ?? currentInner[END];
          // Build an offset surface.
          const polygon = [endOuter, endInner, startInner, startOuter];
          const currentDirection = getDirection(current[0], current[1]);
          if (dot(currentDirection, getDirection(startOuter, endOuter)) < 0) {
            // Swap the direction of the outer offset.
            polygon[0] = startOuter;
            polygon[3] = endOuter;
          }
          if (dot(currentDirection, getDirection(startInner, endInner)) < 0) {
            // Swap the direction of the inner offset.
            polygon[1] = startInner;
            polygon[2] = endInner;
          }
          // These need to be distinct surfaces so that they can be unioned.
          surfaces.push(taggedSurface({}, [polygon]));
        }
      }
      pieces.push(union(...surfaces));
    }
  }

  return Shape.fromGeometry(taggedAssembly({}, ...pieces));
};

const shellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this);
};
Shape.prototype.shell = shellMethod;

const outerShellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this).cut(this);
};
Shape.prototype.outerShell = outerShellMethod;

const innerShellMethod = function (radius, resolution) {
  return Shell(radius, resolution, this).clip(this);
};
Shape.prototype.innerShell = innerShellMethod;

const grow = (shape, amount = 1, { resolution = 3 } = {}) => {
  const normalize = createNormalize3();
  resolution = Math.max(resolution, 3);
  const pieces = [];
  for (const { solid, tags = [] } of getSolids(shape.toDisjointGeometry())) {
    for (const cloud of toConvexClouds(
      fromSolid(solid, normalize),
      normalize
    )) {
      pieces.push(
        Hull(...cloud.map((point) => Sphere(amount, resolution).move(...point)))
          .setTags(tags)
          .toGeometry()
      );
    }
  }
  return Shape.fromGeometry(taggedLayers({}, ...pieces));
};

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

const INTERSECTION_THRESHOLD = 1e-5;

const X = 0;
const Y = 1;
const Z = 2;

const START$1 = 0;
const END$1 = 1;

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
  const planeOfPath = fromPolygon(path);
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
      if (mod(j + 1, path.length) === i) {
        continue;
      }
      const jStart = path[at(j)];
      const jEnd = path[at(j + 1)];
      const [from, to, mua, mub] = closestSegmentBetweenLines([iStart, iEnd], [jStart, jEnd]);
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
  // resolved.push(input); return;
  const path = getMinimumVertexPath(input);
  const selfIntersections = getSelfIntersections(path);
  for (const [k, v] of selfIntersections.entries()) {
    console.log(`QQ/selfIntersection: ${k} ${JSON.stringify(v)}`);
  }
  const start = 0;
  let current = start;
  let from = current;
  const simplePath = [];
  do {
    console.log(`QQ/current: ${current} from: ${from}`);
    const intersections = selfIntersections.get(current);
    console.log(`QQ/Mark/2`);
    // Find where we intersected it, and proceed to the next one.
    if (intersections !== undefined) {
      console.log(`QQ/Mark/3`);
      if (from === current) {
        console.log(`QQ/from == current`);
        // The first intersection.
        simplePath.push(path[current]);
        simplePath.push(intersections[0].vertex);
        from = intersections[0].from;
        current = intersections[0].to;
      } else {
        console.log(`QQ/from != current`);
        let found = false;
        for (let nth = 0; nth < intersections.length; nth++) {
          console.log(`QQ/check: ${nth}`);
          if (intersections[nth].from === from) {
            console.log(`QQ/found: ${nth}`);
            const enter = intersections[nth];
            // We entered on that intersection.
            simplePath.push(enter.vertex);
            const exit = intersections[nth + 1];
            if (exit) {
              console.log(`QQ/exit`);
              // We left on this intersection.
              simplePath.push(exit.vertex);
              // And we were traveling along the exit path when we left.
              from = exit.from;
              current = exit.to;
            } else {
              console.log(`QQ/walk`);
              // We walked to the next vertex.
              current += 1;
              from = current;
            }
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
      console.log(`QQ/no intersections`);
      current = (current + 1) % path.length;
      from = current;
    }
  } while (current !== start);
  console.log(`QQ/simplePath: ${JSON.stringify(simplePath)}`);
  resolved.push(simplePath);
};

const offset = (shape, amount = 1) => {
  console.log(`QQ/offset/amount: ${amount}`);
  const normalize3 = createNormalize3();
  const offsetPathsets = [];
  for (const { tags, paths } of getNonVoidPaths(shape.toDisjointGeometry())) {
    const resolved = [];
    for (const rawPath of paths) {
      const path = deduplicate(rawPath.map(normalize3));
      console.log(`QQ/path: ${JSON.stringify(path)}`);
      // Let's assume this path has a coherent plane.
      const plane = fromPolygon(path);
      const rotate90 = fromRotation(Math.PI / -2, plane);
      const getDirection = (start, end) => normalize(subtract(end, start));
      const getOffset = ([start, end]) => {
        const direction = getDirection(start, end);
        console.log(`QQ/offset/direction: ${direction}`);
        console.log(`QQ/offset/amount: ${amount}`);
        const offset = scale(amount, transform(rotate90, direction));
        console.log(`QQ/offset/offset: ${offset}`);
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
          const [from] = closestSegmentBetweenLines(lastOffset, offset);
          if (from === null) {
            console.log(`QQ/colinear`);
            // This segment is colinear with the last, overwrite it.
            offsetPath.pop();
          } else {
            console.log(`QQ/rewrite`);
            // Rewrite the previous end point to be the intersection.
            offsetPath.pop();
            offsetPath.push(from);
          }
          offsetPath.push(offset[END$1]);
        } else {
          console.log(`QQ/initial`);
          offsetPath.push(offset[START$1], offset[END$1]);
        }
        lastOffset = offset;
      }

      // Update the initial start point, now that we know where the last is.
      if (lastOffset) {
        const offset = getOffset(edges[0]);
        const [from] = closestSegmentBetweenLines(lastOffset, offset);
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

const offsetMethod = function (amount) {
  return offset(this, amount);
};
Shape.prototype.offset = offsetMethod;

const shrink = (shape, amount, { resolution = 3 } = {}) => {
  if (amount === 0) {
    return shape;
  } else {
    return shape.cut(Shell(amount, { resolution }, shape));
  }
};

const shrinkMethod = function (amount, { resolution = 3 } = {}) {
  return shrink(this, amount, { resolution });
};
Shape$1.prototype.shrink = shrinkMethod;

const api = {
  Shell,
  grow,
  offset,
  shrink,
};

export default api;
export { Shell, grow, offset, shrink };
