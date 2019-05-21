import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Back
 *
 * Moves the shape so that it is just behind the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cylinder(2, 15).translate([0, 0, 2.5]),
 *          cube(10).back())
 * ```
 * :::
 **/


const Y = 1;

export const back = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return translate(negate([0, maxPoint[Y], 0]), shape);
};

const method = function () { return back(this); };

Shape.prototype.back = method;
