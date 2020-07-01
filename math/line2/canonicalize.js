import { fromValues } from './fromValues.js';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';

export const canonicalize = ([x = 0, y = 0, w = 0]) =>
  fromValues(q(x), q(y), q(w));
