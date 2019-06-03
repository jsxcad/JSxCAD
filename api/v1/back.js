import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

/**
 *
 * # Back
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(cylinder(2, 15).translate([0, 0, 2.5]),
 *          cube(10).back())
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * cube(10).back(sphere(5))
 * ```
 * :::
 **/

const Y = 1;

export const fromOrigin = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate([0, -minPoint[Y], 0], shape);
};

export const fromReference = (shape, reference) => {
  const [minPoint] = measureBoundingBox(shape);
  const [, maxRefPoint] = measureBoundingBox(reference);
  return assemble(reference, translate([0, maxRefPoint[Y] - minPoint[Y], 0], shape));
};

export const back = dispatch(
  'back',
  // back(cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin(shape);
  },
  // back(cube(), sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference(shape, reference);
  });

const method = function (...params) { return back(this, ...params); };

Shape.prototype.back = method;
