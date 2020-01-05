import Shape from './jsxcad-api-v1-shape.js';
import { deform } from './jsxcad-algorithm-bsp-surfaces.js';
import { getSolids } from './jsxcad-geometry-tagged.js';
import { measureBoundingBox } from './jsxcad-geometry-solid.js';
import { rotateZ } from './jsxcad-math-vec3.js';

const Z = 2;

const twist = (shape, angle = 0, { resolution = 1 } = {}) => {
  const radians = angle * Math.PI / 180;
  const rotate = point => rotateZ(point, radians * point[Z]);
  const assembly = [];

  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    for (let z = min[Z] + resolution; z < max[Z] - resolution; z += resolution) {
    }
    assembly.push({ solid: deform(solid, rotate, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const twistMethod = function (...args) { return twist(this, ...args); };
Shape.prototype.twist = twistMethod;

const api = { twist };

export default api;
export { twist };
