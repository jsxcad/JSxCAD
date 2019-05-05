import { Shape } from './Shape';
import { readFile } from '@jsxcad/sys';
import { toSvg } from '@jsxcad/convert-svg';

export const readSvg = async ({ path }) => Shape.fromGeometry(toSvg({}, await readFile({}, path)));
