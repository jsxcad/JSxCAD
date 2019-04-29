import { Assembly } from './Assembly';
import { fromSvgPath } from '@jsxcad/convert-svg';

export const svgPath = (options = {}, svgPath) =>
  Assembly.fromGeometry(fromSvgPath(options, svgPath));
