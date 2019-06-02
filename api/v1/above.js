import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

/**
 *
 * # Above
 *
 * Moves the shape so that it is just above another shape (defaulting to the origin).
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * assemble(cube(10).above(),
 *          cylinder(2, 15).rotateY(90))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cube(10).above(sphere(5))
 * ```
 * :::
 **/

const Z = 2;

export const fromOrigin = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate([0, 0, -minPoint[Z]], shape);
};

export const fromReference = (shape, reference) => {
  const [minPoint] = measureBoundingBox(shape);
  const [, maxRefPoint] = measureBoundingBox(reference);
  return assemble(reference, translate([0, 0, maxRefPoint[Z] - minPoint[Z]], shape));
};

export const above = dispatch(
  'above',
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

const method = function (...params) { return above(this, ...params); };

Shape.prototype.above = method;
