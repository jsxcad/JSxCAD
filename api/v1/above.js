import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Above
 *
 * Moves the shape so that it is just above the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cube(10).above(),
 *          cylinder(2, 15).rotateY(90))
 * ```
 * :::
 **/

const Z = 2;

export const above = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([0, 0, minPoint[Z]]), shape);
};

const method = function () { return above(this); };

Shape.prototype.above = method;
