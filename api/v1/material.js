import Shape from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';

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

export const material = (shape, ...tags) =>
  Shape.fromGeometry(addTags(tags.map(tag => `material/${tag}`), shape.toGeometry()));

const materialMethod = function (...tags) { return material(this, ...tags); };
Shape.prototype.material = materialMethod;

export default material;
