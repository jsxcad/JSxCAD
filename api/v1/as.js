import Shape from './Shape';
import { rewriteTags } from '@jsxcad/geometry-tagged';

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

export const as = (shape, tags) =>
  Shape.fromGeometry(rewriteTags(tags.map(tag => `user/${tag}`), [], shape.toGeometry()));

export const notAs = (shape, tags) =>
  Shape.fromGeometry(rewriteTags([], tags.map(tag => `user/${tag}`), shape.toGeometry()));

const asMethod = function (...tags) { return as(this, tags); };
const notAsMethod = function (...tags) { return notAs(this, tags); };

Shape.prototype.as = asMethod;
Shape.prototype.notAs = notAsMethod;
