import { Shape } from './Shape.js';
import { setTestMode } from '@jsxcad/algorithm-cgal';

// rx is in terms of turns -- 1/2 is a half turn.
export const testMode = Shape.registerMethod(
  'testMode',
  (mode = true, op) =>
    (s) => {
      try {
        setTestMode(mode);
        return op(s);
      } finally {
        setTestMode(false);
      }
    }
);
