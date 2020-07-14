import Shape from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

/**
 * Moves the left front corner to the left front corner of the bench
 * and places the top level with the bench top at Z = 0.
 *
 * Operations are downward and relative to the top of the shape.
 */

export const bench = (shape, x = 0, y = 0, z = 0) => {
  const { max, min, width } = shape.size();
  return shape.move(0 - x - min[X], 0 - y - min[Y] - width / 2, 0 - z - max[Z]);
};

const benchMethod = function (x, y, z) {
  return bench(this, x, y, z);
};
Shape.prototype.bench = benchMethod;

export default bench;

/**
 * Moves the left front corner to the left front corner of the bench
 * and places the bottom level with the bench top at Z = 0.
 *
 * Operations are upward and relative to the bottom of the shape.
 */

export const benchTop = (shape, x = 0, y = 0, z = 0) => {
  const { min, width } = shape.size();
  return shape.move(0 - x - min[X], 0 - y - width / 2, 0 - z - min[Z]);
};

const benchTopMethod = function (x, y, z) {
  return benchTop(this, x, y, z);
};
Shape.prototype.benchTop = benchTopMethod;
