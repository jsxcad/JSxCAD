import Shape from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';

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

export const as = (tags, shape) =>
  Shape.fromGeometry(addTags(tags.map(tag => `user/${tag}`), shape.toGeometry()));

const method = function (...tags) { return as(tags, this); };
Shape.prototype.as = method;

export default as;
