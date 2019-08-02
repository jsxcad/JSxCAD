import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

/**
 *
 * # Left
 *
 * Moves the shape so that it is just to the left of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).left(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).left(Sphere(5))
 * ```
 * :::
 **/

const X = 0;

export const fromOrigin = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return translate([-maxPoint[X], 0, 0], shape);
};

export const fromReference = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, translate([minRefPoint[X] - maxPoint[X], 0, 0], shape));
};

export const left = dispatch(
  'left',
  // front(cube())
  (shape, ...rest) => {
    assertShape(shape);
    assertEmpty(rest);
    return () => fromOrigin(shape);
  },
  // front(cube(), sphere())
  (shape, reference) => {
    assertShape(shape);
    assertShape(reference);
    return () => fromReference(shape, reference);
  });

const method = function (...params) { return left(this, ...params); };

Shape.prototype.left = method;
