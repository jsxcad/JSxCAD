import { assertShape, assertStrings } from './assert';

import { Shape } from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';
import { dispatch } from './dispatch';

/**
 *
 * # Color
 *
 * Produces a version of a shape the given color.
 *
 * ::: illustration
 * ```
 * Circle(10).color('blue')
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => Shape.fromGeometry(addTags(tags.map(tag => `color/${tag}`), shape.toGeometry()));

export const color = dispatch(
  'color',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags, shape);
  }
);

color.fromValues = fromValue;

const method = function (...tags) { return color(tags, this); };

Shape.prototype.color = method;
