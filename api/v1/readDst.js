import { dstToZ0Paths } from '@jsxcad/convert-dst';
import { readFile } from '@jsxcad/sys';

export const readDst = async ({ path }) => dstToZ0Paths({}, await readFile(path));
