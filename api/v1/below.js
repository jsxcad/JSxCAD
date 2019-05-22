import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Below
 *
 * Moves the shape so that it is just below the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 10] } }
 * ```
 * assemble(cylinder(2, 15).rotateY(90),
 *          cube(10).below())
 * ```
 * :::
 **/

const Z = 2;

export const below = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return translate(negate([0, 0, maxPoint[Z]]), shape);
};

const method = function () { return below(this); };

Shape.prototype.below = method;
