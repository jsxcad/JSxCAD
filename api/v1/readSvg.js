import { Assembly } from './Assembly';
import { readFile } from '@jsxcad/sys';
import { svgToAssembly } from '@jsxcad/convert-svg';

export const readJscad = async ({ path }) => Assembly.fromAssembly(svgToAssembly({}, await readFile(path)));
