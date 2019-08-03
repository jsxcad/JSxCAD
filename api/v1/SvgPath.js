import { Shape } from './Shape';
import { fromSvgPath } from '@jsxcad/convert-svg';

/**
 *
 * # Svg Path
 *
 * Generates a path from svg path data.
 *
 * ::: illustration
 * ```
 * SvgPath({},
 *         'M 120.25163,89.678938 C 105.26945,76.865343 86.290871,70.978848 64.320641,70.277872 z')
 *   .center()
 *   .scale(0.2)
 * ```
 * :::
 *
 **/

export const SvgPath = (options = {}, svgPath) =>
  Shape.fromGeometry(fromSvgPath(options, svgPath));
