import { Shape, fromGeometry, toGeometry } from './Shape';
import { assertShape, assertStrings } from './assert';

import { dispatch } from './dispatch';
import { drop as dropGeometry } from '@jsxcad/geometry-eager';

/**
 *
 * # Drop from assembly
 *
 * Generates an assembly from components in an assembly without a tag.
 *
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 *   .drop('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 *   .drop('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 *   .drop('A', 'B')
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => fromGeometry(dropGeometry(tags, toGeometry(shape)));

export const drop = dispatch(
  'drop',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags, shape);
  }
);

drop.fromValues = fromValue;

const method = function (...tags) { return drop(tags, this); };

Shape.prototype.drop = method;
