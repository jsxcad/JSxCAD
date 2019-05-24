import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { negate } from '@jsxcad/math-vec3';
import { translate } from './translate';

/**
 *
 * # Right
 *
 * Moves the shape so that it is just to the right of the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cube(10).right(),
 *          cylinder(2, 15))
 * ```
 * :::
 **/

const X = 0;

export const right = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate(negate([minPoint[X], 0, 0]), shape);
};

const method = function () { return right(this); };

Shape.prototype.right = method;
