import Shape from './Shape';
import { rewriteTags } from '@jsxcad/geometry-tagged';
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
  Shape.fromGeometry(rewriteTags([toTagFromName(name)], [], shape.toGeometry()));

export const color = (...args) => fromName(...args);

const colorMethod = function (...args) { return color(this, ...args); };
Shape.prototype.color = colorMethod;

color.signature = 'Shape -> color(color:string) -> Shape';

export default color;
