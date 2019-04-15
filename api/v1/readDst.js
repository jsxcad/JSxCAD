import { dstToZ0Paths } from '@jsxcad/algorithm-dst';
import { readFile } from '@jsxcad/sys';

export const readDst = async ({ path }) => dstToZ0Paths({}, await readFile(path));
