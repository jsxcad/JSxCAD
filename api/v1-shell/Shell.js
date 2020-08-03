import { add, normalize, scale, subtract, transform } from '@jsxcad/math-vec3';

import {
  getAnyNonVoidSurfaces,
  getNonVoidSolids,
  taggedAssembly,
  taggedSurface,
  union,
} from '@jsxcad/geometry-tagged';

import { Hull } from '@jsxcad/api-v1-extrude';
import { Shape } from '@jsxcad/api-v1-shape';
import { Sphere } from '@jsxcad/api-v1-shapes';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromRotation } from '@jsxcad/math-mat4';
import { getEdges } from '@jsxcad/geometry-path';
import { closestSegmentBetweenLines as intersect } from '@jsxcad/math-line3';
import { outlineSurface } from '@jsxcad/geometry-halfedge';
import { toPlane as toPlaneFromSurface } from '@jsxcad/geometry-surface';

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

export const Shell = (radius = 1, resolution = 3, ...shapes) => {
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
      const plane = toPlaneFromSurface(thisSurface);
      const rotate90 = fromRotation(Math.PI / -2, plane);
      const getOffset = ([start, end]) => {
        const direction = normalize(subtract(end, start));
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
          const startOuter =
            intersect(lastOuter, currentOuter)[END] ?? currentOuter[START];
          const endOuter =
            intersect(currentOuter, nextOuter)[START] ?? currentOuter[END];
          const startInner =
            intersect(lastInner, currentInner)[END] ?? currentInner[START];
          const endInner =
            intersect(currentInner, nextInner)[START] ?? currentInner[END];
          // Build an offset surface.
          const polygon = [endOuter, endInner, startInner, startOuter];
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

export default Shell;