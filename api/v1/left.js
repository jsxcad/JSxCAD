import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Left
 *
 * Moves the shape so that it is just to the left of the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cube(10).left(),
 *          cylinder(2, 15))
 * ```
 * :::
 **/

const X = 0;

export const left = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return translate(negate([maxPoint[X], 0, 0]), shape);
};

const method = function () { return left(this); };

Shape.prototype.left = method;
