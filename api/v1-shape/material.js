import Shape from './Shape.js';

import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-material';

/**
 *
 * # Material
 *
 * Produces a version of a shape with a given material.
 *
 * Materials supported include 'paper', 'metal', 'glass', etc.
 *
 * ::: illustration
 * ```
 * Cylinder(5, 10).material('copper')
 * ```
 * :::
 *
 **/

export const material = (shape, name) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], shape.toGeometry()));

const materialMethod = function (name) {
  return material(this, name);
};
Shape.prototype.material = materialMethod;

export default material;
