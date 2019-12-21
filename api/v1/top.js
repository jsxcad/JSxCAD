import { add, dot, scale } from '@jsxcad/math-vec3';

import Connector from './Connector';
import Shape from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';
import { toPlane } from '@jsxcad/geometry-surface';

export const top = (shape) => {
  const targetPlane = [0, 0, 1, 0];
  let bestSurface;
  let bestAlignment = -Infinity;

  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      const alignment = dot(toPlane(surface), targetPlane);
      if (alignment > bestAlignment) {
        bestAlignment = alignment;
        bestSurface = surface;
      }
    }
  }

  // FIX:
  // This will produce the average position, but that's probably not what we
  // want, since it will include interior points produced by breaking up
  // convexity.
  let sum = [0, 0, 0];
  let count = 0;
  for (const path of bestSurface) {
    for (const point of path) {
      sum = add(sum, point);
      count += 1;
    }
  }
  const center = scale(1 / count, sum);
  return shape.toConnector(Connector('top', { plane: toPlane(bestSurface), center, right: add(center, [0, 1, 0]) }));
};

const topMethod = function () { return top(this); };
Shape.prototype.top = topMethod;

top.signature = 'top(shape:Shape) -> Shape';
topMethod.signature = 'Shape -> top() -> Shape';
