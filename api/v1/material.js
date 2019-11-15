import { assertShape, assertStrings } from './assert';

import { Shape } from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';
import { dispatch } from './dispatch';

/**
 *
 * # Material
 *
 * Produces a version of a shape with a given material.
 *
 * Materials supported include 'paper', 'metal', 'glass'.
 *
 * ::: illustration
 * ```
 * Cylinder(5, 10).material('paper').color('pink')
 * ```
 * :::
 * ::: illustration
 * ```
 * Cylinder(5, 10).material('metal').color('green')
 * ```
 * :::
 * ::: illustration
 * ```
 * Cylinder(5, 10).material('glass').color('blue')
 * ```
 * :::
 *
 **/

export const fromValue = (tags, shape) => Shape.fromGeometry(addTags(tags.map(tag => `material/${tag}`),
                                                                     shape.toGeometry()));

export const material = dispatch(
  'material',
  (tags, shape) => {
    assertStrings(tags);
    assertShape(shape);
    return () => fromValue(tags, shape);
  }
);

material.fromValues = fromValue;

const method = function (...tags) { return material(tags, this); };

Shape.prototype.material = method;
