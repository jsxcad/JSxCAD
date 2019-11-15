
import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { moveY } from './moveY';

/**
 *
 * # Front
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cylinder(2, 15).translate([0, 0, 2.5]),
 *          Cube(10).front())
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).front(Sphere(5))
 * ```
 * :::
 **/

const Y = 1;

export const fromOrigin = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveY(shape, -maxPoint[Y]);
};

export const fromReference = (shape, reference) => {
  const [, maxPoint] = measureBoundingBox(shape);
  const [minRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveY(shape, minRefPoint[Y] - maxPoint[Y]));
};

export const front = dispatch(
  'front',
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

const method = function (...params) { return front(this, ...params); };

Shape.prototype.front = method;
