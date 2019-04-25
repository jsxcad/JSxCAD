import { Paths } from './Paths';
import { svgPathToPaths } from '@jsxcad/convert-svg';

export const svgPath = (options = {}, svgPath) => Paths.fromPaths(svgPathToPaths(options, svgPath));
