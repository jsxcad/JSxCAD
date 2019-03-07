import { flip as flipOfPath } from '@jsxcad/algorithm-path';

export const flip = (paths) => paths.map(flipOfPath);
