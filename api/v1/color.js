import Shape from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';

/**
 *
 * # Color
 *
 * Produces a version of a shape the given color.
 * FIX: Support color in convert/threejs/toSvg.
 *
 * ::: illustration
 * ```
 * Circle(10).color('blue')
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle(10).color('chartreuse')
 * ```
 * :::
 *
 **/

export const fromName = (tags, shape) =>
  Shape.fromGeometry(addTags(tags.map(tag => `color/${tag}`), shape.toGeometry()));

export const color = (...args) => fromName(...args);

const colorMethod = function (...tags) { return color(tags, this); };
Shape.prototype.color = colorMethod;

export default color;
