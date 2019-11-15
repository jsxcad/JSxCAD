import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { moveZ } from './moveZ';

/**
 *
 * # Below
 *
 * Moves the shape so that it is just below the origin.
 *
 * ::: illustration { "view": { "position": [40, 40, 10] } }
 * ```
 * assemble(Cylinder(2, 15).rotateY(90),
 *          Cube(10).below())
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cube(10).below(Sphere(5))
 * ```
 * :::
 **/

const Z = 2;

export const fromOrigin = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveZ(shape, -maxPoint[Z]);
};

export const fromReference = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveZ(shape, minRefPoint[Z] - maxPoint[Z]));
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
