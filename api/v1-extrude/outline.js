import { Shape, assemble } from "@jsxcad/api-v1-shape";

import { outline as outlineGeometry } from "@jsxcad/geometry-tagged";

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
  assemble(
    ...outlineGeometry(shape.toGeometry()).map((outline) =>
      Shape.fromGeometry(outline)
    )
  );

const outlineMethod = function (options) {
  return outline(this);
};
const withOutlineMethod = function (options) {
  return assemble(this, outline(this));
};

Shape.prototype.outline = outlineMethod;
Shape.prototype.withOutline = withOutlineMethod;

outline.signature = "outline(shape:Surface) -> Shape";
outlineMethod.signature = "Shape -> outline() -> Shape";
withOutlineMethod.signature = "Shape -> outline() -> Shape";

export default outline;
