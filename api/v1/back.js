import { assertEmpty, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { measureBoundingBox } from './measureBoundingBox';
import { moveY } from './moveY';

/**
 *
 * # Back
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cylinder(2, 15).translate([0, 0, 2.5]),
 *          Cube(10).back())
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).back(Sphere(5))
 * ```
 * :::
 **/

const Y = 1;

export const fromOrigin = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return moveY(shape, -minPoint[Y]);
};

export const fromReference = (shape, reference) => {
  const [minPoint] = measureBoundingBox(shape);
  const [, maxRefPoint] = measureBoundingBox(reference);
  return assemble(reference, moveY(shape, maxRefPoint[Y] - minPoint[Y]));
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
