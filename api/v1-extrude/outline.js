import { Assembly } from '@jsxcad/api-v1-shapes';
import { Shape } from '@jsxcad/api-v1-shape';
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

export const outline = (shape) =>
  Assembly(
    ...outlineGeometry(shape.toGeometry()).map((outline) =>
      Shape.fromGeometry(outline)
    )
  );

const outlineMethod = function (options) {
  return outline(this);
};

const withOutlineMethod = function (options) {
  return this.with(outline(this));
};

Shape.prototype.outline = outlineMethod;
Shape.prototype.withOutline = withOutlineMethod;

export default outline;
