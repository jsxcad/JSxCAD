import { Shape, fromGeometry, toGeometry } from './Shape';
import { assertShape, assertStrings } from './assert';

import { dispatch } from './dispatch';
import { keep as keepGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Keep in assembly
 *
 * Generates an assembly from components in an assembly with a tag.
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
 *   .keep('A')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 *   .keep('B')
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10).as('A'),
 *          square(10).as('B'))
 *   .keep('A', 'B')
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => fromGeometry(keepGeometry(tags, toGeometry(shape)));

export const keep = dispatch(
  'keep',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags, shape);
  }
);

keep.fromValues = fromValue;

const method = function (...tags) { return keep(tags, this); };

Shape.prototype.keep = method;
