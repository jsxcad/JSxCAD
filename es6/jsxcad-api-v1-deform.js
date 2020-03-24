import { measureBoundingBox, makeWatertight } from './jsxcad-geometry-solid.js';
import { Random } from './jsxcad-api-v1-math.js';
import Shape from './jsxcad-api-v1-shape.js';
import { deform } from './jsxcad-algorithm-bsp-surfaces.js';
import { getSolids } from './jsxcad-geometry-tagged.js';
import { scale } from './jsxcad-math-vec2.js';
import { rotateZ } from './jsxcad-math-vec3.js';

const crumple = (shape, amount = 0.1, { resolution = 1, rng = Random() } = {}) => {
  const offset = v => v + (rng() - 0.5) * amount * 2;
  // FIX: Use a smooth noise function, maybe perlin.
  const perturb = ([x, y, z]) => [offset(x), offset(y), offset(z)];

  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    assembly.push({ solid: deform(makeWatertight(solid), perturb, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const crumpleMethod = function (...args) { return crumple(this, ...args); };
Shape.prototype.crumple = crumpleMethod;

const Z = 2;

const scaleXY = (factor, [x, y, z]) => [...scale(factor, [x, y]), z];

// TODO: Support different factors for x and y.
const taper = (shape, factor, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const maxZ = max[Z];
    const minZ = min[Z];
    const height = maxZ - minZ;
    const widthAt = z => 1 - (z - minZ) / height * (1 - factor);
    const squeeze = ([x, y, z]) => scaleXY(widthAt(z), [x, y, z]);
    assembly.push({ solid: deform(makeWatertight(solid), squeeze, min, max, resolution), tags });
  }

  return Shape.fromGeometry({ assembly });
};

const taperMethod = function (...args) { return taper(this, ...args); };
Shape.prototype.taper = taperMethod;

const Z$1 = 2;

const twist = (shape, angle = 0, { resolution = 1 } = {}) => {
  const assembly = [];
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const [min, max] = measureBoundingBox(solid);
    const height = max[Z$1] - min[Z$1];
    const radians = (angle / height) * (Math.PI / 180);
    const rotate = point => rotateZ(point, radians * (point[Z$1] - min[Z$1]));
    assembly.push({ solid: deform(makeWatertight(solid), rotate, min, max, resolution), tags });
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
