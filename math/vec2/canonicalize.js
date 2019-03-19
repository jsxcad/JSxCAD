import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';

export const canonicalize = ([x, y]) => [q(x), q(y)];
