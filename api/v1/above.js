import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { moveZ } from './moveZ';

/**
 *
 * # Above
 *
 * Moves the shape so that its lowest point is at z = 0.
 *
 * ::: illustration { "view": { "position": [60, -60, 0], "target": [0, 0, 0] } }
 * ```
 * Cube(10).above()
 * ```
 * :::
 **/

const MIN = 0;
const Z = 2;

export const above = (shape, reference) => {
  return moveZ(shape, -measureBoundingBox(shape)[MIN][Z]);
};

const aboveMethod = function (...params) { return above(this, ...params); };
Shape.prototype.above = aboveMethod;
