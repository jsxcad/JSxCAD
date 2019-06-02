import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
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
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cube(10).below(sphere(5))
 * ```
 * :::
 **/

const Z = 2;

export const fromOrigin = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return translate([0, 0, -maxPoint[Z]], shape);
};

export const fromReference = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, translate([0, 0, minRefPoint[Z] - maxPoint[Z]], shape));
};

export const below = dispatch(
  'below',
  // above(cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin(shape);
  },
  // above(cube(), sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference(shape, reference);
  });

const method = function (...params) { return below(this, ...params); };

Shape.prototype.below = method;
