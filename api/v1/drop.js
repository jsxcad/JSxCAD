import { Shape, fromGeometry, toGeometry } from './Shape';
import { addTags, drop as dropGeometry } from '@jsxcad/geometry-tagged';
import { assertEmpty, assertShape, assertStrings } from './assert';

import { dispatch } from './dispatch';

/**
 *
 * # Drop from assembly
 *
 * Generates an assembly from components in an assembly without a tag.
 *
 * If no tag is supplied, the whole shape is dropped.
 *
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .drop('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .drop('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .drop('A', 'B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Cube(10).below(),
 *          Cube(8).below().drop())
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => fromGeometry(dropGeometry(tags, toGeometry(shape)));

export const drop = dispatch(
  'drop',
  (tags, shape) => {
    // assemble(circle(), circle().drop())
    assertEmpty(tags);
    assertShape(shape);
    return () => fromGeometry(addTags(['compose/non-positive'], toGeometry(shape)));
  },
  (tags, shape) => {
    // assemble(circle(), circle().as('a')).drop('a')
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags.map(tag => `user/${tag}`), shape);
  }
);

drop.fromValues = fromValue;

const method = function (...tags) { return drop(tags, this); };

Shape.prototype.drop = method;
