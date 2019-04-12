import { dstToZ0Paths } from '@jsxcad/algorithm-dst';
import { readFileSync } from '@jsxcad/sys';

export const readDst = ({ path }) => dstToZ0Paths({}, readFileSync(path));
