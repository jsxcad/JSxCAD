import { transform as transformOfPath } from '@jsxcad/algorithm-path';

export const transform = (matrix, paths) => paths.map(path => transformOfPath(matrix, path));
