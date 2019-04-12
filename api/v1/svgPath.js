import { Path2D } from './Path2D';
import { svgPathToPaths } from '@jsxcad/algorithm-svg';

export const svgPath = (options = {}, svgPath) => Path2D.fromPaths(svgPathToPaths(options, svgPath));
