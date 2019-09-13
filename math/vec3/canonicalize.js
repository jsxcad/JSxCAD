import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';

// Normalize negative zero to positive zero.
const f = (v) => v === 0 ? 0 : v;

export const canonicalize = ([x = 0, y = 0, z = 0]) => [f(q(x)), f(q(y)), f(q(z))];
