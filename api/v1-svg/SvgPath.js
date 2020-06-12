import { Shape } from "@jsxcad/api-v1-shape";
import { fromSvgPath } from "@jsxcad/convert-svg";

/**
 *
 * # Svg Path
 *
 * Generates a path from svg path data.
 *
 * ::: illustration
 * ```
 * SvgPath('M 120.25163,89.678938 C 105.26945,76.865343 86.290871,70.978848 64.320641,70.277872 z')
 *   .center()
 *   .scale(0.2)
 * ```
 * :::
 *
 **/

export const SvgPath = (svgPath, options = {}) =>
  Shape.fromGeometry(
    fromSvgPath(new TextEncoder("utf8").encode(svgPath), options)
  );

export default SvgPath;
