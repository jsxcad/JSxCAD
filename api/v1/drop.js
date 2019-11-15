import { Shape, fromGeometry, toGeometry } from './Shape';
import { addTags, drop as dropGeometry } from '@jsxcad/geometry-tagged';

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

export const drop = (...tags) => {
  if (tag.length === 0) {
    return fromGeometry(addTags(['compose/non-positive'], toGeometry(shape)));
  } else {
    return fromGeometry(dropGeometry(tags.map(tag => `user/${tag}`), toGeometry(shape)));
  }
};

const method = function (...tags) { return drop(tags, this); };
Shape.prototype.drop = method;
