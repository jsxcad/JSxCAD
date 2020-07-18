import { getSolids, taggedPoints } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { junctionSelector } from '@jsxcad/geometry-halfedge';

export const junctions = (shape, mode = (n) => n) => {
  const junctions = [];
  const points = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const normalize = createNormalize3();
    const select = junctionSelector(solid, normalize);
    for (const surface of solid) {
      for (const path of surface) {
        for (const point of path) {
          points.push(normalize(point));
        }
      }
    }
    for (const point of points) {
      if (mode(select(point))) {
        junctions.push(point);
      }
    }
  }
  return Shape.fromGeometry(taggedPoints({}, junctions));
};

export const nonJunctions = (shape) => junctions(shape, (n) => !n);

const junctionsMethod = function () {
  return junctions(this);
};
Shape.prototype.junctions = junctionsMethod;

const nonJunctionsMethod = function () {
  return nonJunctions(this);
};
Shape.prototype.nonJunctions = nonJunctionsMethod;

export default junctions;
