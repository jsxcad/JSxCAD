import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Front
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cylinder(2, 15).translate([0, 0, 2.5]),
 *          cube(10).front())
 * ```
 * :::
 **/

const Y = 1;

export const front = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([0, minPoint[Y], 0]), shape);
};

const method = function () { return front(this); };

Shape.prototype.front = method;
