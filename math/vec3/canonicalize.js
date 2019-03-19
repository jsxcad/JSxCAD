import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';

export const canonicalize = ([x = 0, y = 0, z = 0]) => [q(x), q(y), q(z)];
