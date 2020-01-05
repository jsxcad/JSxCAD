import { Random } from './jsxcad-api-v1-math.js';
import Shape from './jsxcad-api-v1-shape.js';
import { deform } from './jsxcad-algorithm-bsp-surfaces.js';
import { getSolids } from './jsxcad-geometry-tagged.js';
import { measureBoundingBox } from './jsxcad-geometry-solid.js';
import { scale } from './jsxcad-math-vec2.js';
import { rotateZ } from './jsxcad-math-vec3.js';

const crumple = (shape, amount = 1, { resolution = 1, rng = Random() } = {}) => {
  const offset = v => v + (rng() - 0.5) * amount * 2;
  const perturb = ([x, y, z]) => [offset(x), offset(y), offset(z)];

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(solid, perturb, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const crumpleMethod = function (...args) { return crumple(this, ...args); };
Shape.prototype.crumple = crumpleMethod;

const scaleXY = (factor, [x, y, z]) => [...scale(factor, [x, y]), z];

const taper = (shape, gradient = 1, { resolution = 1 } = {}) => {
  const squeeze = ([x, y, z]) => scaleXY(1 - z * gradient, [x, y, z]);

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(solid, squeeze, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const taperMethod = function (...args) { return taper(this, ...args); };
Shape.prototype.taper = taperMethod;

const Z = 2;

const twist = (shape, angle = 0, { resolution = 1 } = {}) => {
  const radians = angle * Math.PI / 180;
  const rotate = point => rotateZ(point, radians * point[Z]);

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(solid, rotate, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const twistMethod = function (...args) { return twist(this, ...args); };
Shape.prototype.twist = twistMethod;

const api = {
  crumple,
  taper,
  twist
};

export default api;
export { crumple, taper, twist };
