import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

/**
 *
 * # Right
 *
 * Moves the shape so that it is just to the right of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).right(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).right(Sphere(5))
 * ```
 * :::
 **/

const X = 0;

export const fromOrigin = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return translate([-minPoint[X], 0, 0], shape);
};

export const fromReference = (shape, reference) => {
  const [minPoint] = measureBoundingBox(shape);
  const [, maxRefPoint] = measureBoundingBox(reference);
  return assemble(reference, translate([maxRefPoint[X] - minPoint[X], 0, 0], shape));
};

export const right = dispatch(
  'right',
  // right(Cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin(shape);
  },
  // right(Cube(), Sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference(shape, reference);
  });

const method = function (...params) { return right(this, ...params); };

Shape.prototype.right = method;
