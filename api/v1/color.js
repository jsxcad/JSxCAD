import Shape from './Shape';
import { addTags } from '@jsxcad/geometry-tagged';
import { toTagFromName } from '@jsxcad/algorithm-color';

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

export const fromName = (shape, name) =>
  Shape.fromGeometry(addTags([toTagFromName(name)], shape.toGeometry()));

export const color = (...args) => fromName(...args);

const colorMethod = function (...args) { return color(this, ...args); };
Shape.prototype.color = colorMethod;

export default color;
