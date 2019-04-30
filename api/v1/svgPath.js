import { Shape } from './Shape';
import { fromSvgPath } from '@jsxcad/convert-svg';

export const svgPath = (options = {}, svgPath) =>
  Shape.fromGeometry(fromSvgPath(options, svgPath));
