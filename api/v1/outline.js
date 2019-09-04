import { Shape } from './Shape';
import { assemble } from './assemble';
import { outline as outlineGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Outline
 *
 * Generates the outline of a surface.
 *
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2).move([-4]),
 *            Circle(2).move([4]))
 * ```
 * :::
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(2).move([-4]),
 *            Circle(2).move([4]))
 *   .outline()
 * ```
 * :::
 *
 **/

export const outline = (options = {}, shape) => Shape.fromGeometry(outlineGeometry(shape.toGeometry()));

const method = function (options) { return outline(options, this); };

Shape.prototype.outline = method;
Shape.prototype.withOutline = function (options) { return assemble(this, outline(options, this)); };
