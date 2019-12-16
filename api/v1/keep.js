import { Shape, fromGeometry, toGeometry } from './Shape';

import { keep as keepGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Keep in assembly
 *
 * Generates an assembly from components in an assembly with a tag.
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
 *   .keep('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10).as('A'),
 *          Square(10).as('B'))
 *   .keep('A', 'B')
 * ```
 * :::
 *
 **/

export const keep = (shape, tags) => fromGeometry(keepGeometry(tags.map(tag => `user/${tag}`), toGeometry(shape)));

const keepMethod = function (...tags) { return keep(this, tags); };
Shape.prototype.keep = keepMethod;

keep.signature = 'keep(shape:Shape, tags:strings) -> Shape';
keepMethod.signature = 'Shape -> keep(tags:strings) -> Shape';
