import { assertShape, assertStrings } from './assert';

import { Shape } from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';
import { dispatch } from './dispatch';

/**
 *
 * # As
 *
 * Produces a version of a shape with user defined tags.
 *
 * ::: illustration
 * ```
 * Circle(10).as('A')
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => Shape.fromGeometry(addTags(tags.map(tag => `user/${tag}`), shape.toGeometry()));

export const as = dispatch(
  'as',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags, shape);
  }
);

as.fromValues = fromValue;

const method = function (...tags) { return as(tags, this); };

Shape.prototype.as = method;
