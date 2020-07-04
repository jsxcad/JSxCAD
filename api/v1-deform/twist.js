import {
  getSolids,
  taggedAssembly,
  taggedSolid,
} from '@jsxcad/geometry-tagged';
import { makeWatertight, measureBoundingBox } from '@jsxcad/geometry-solid';

import Shape from '@jsxcad/api-v1-shape';
import { deform } from '@jsxcad/geometry-bsp';
import { rotateZ } from '@jsxcad/math-vec3';

const Z = 2;

export const twist = (shape, angle = 0, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const height = max[Z] - min[Z];
    const radians = (angle / height) * (Math.PI / 180);
    const rotate = (point) => rotateZ(point, radians * (point[Z] - min[Z]));
    assembly.push(
      taggedSolid(
        { tags },
        deform(makeWatertight(solid), rotate, min, max, resolution)
      )
    );
  }

  return Shape.fromGeometry(taggedAssembly({}, ...assembly));
};

const twistMethod = function (...args) {
  return twist(this, ...args);
};
Shape.prototype.twist = twistMethod;

export default twist;
