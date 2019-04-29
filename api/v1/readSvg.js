import { Assembly } from './Assembly';
import { readFile } from '@jsxcad/sys';
import { toSvg } from '@jsxcad/convert-svg';

export const readSvg = async ({ path }) => Assembly.fromGeometry(toSvg({}, await readFile(path)));
