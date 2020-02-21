import { Shape, assemble } from '@jsxcad/api-v1-shape';

import { Y } from '@jsxcad/api-v1-connector';
import { getPaths } from '@jsxcad/geometry-tagged';
import { loop as loopPath } from '@jsxcad/algorithm-shape';

/**
 *
 * # Lathe
 *
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * ```
 * :::
 *
 **/

export const Loop = (shape, endDegrees = 360, { sides = 32, pitch = 0 } = {}) => {
  const profile = shape.chop(Y(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      for (let startDegrees = 0; startDegrees < endDegrees; startDegrees += 360) {
        solids.push(Shape.fromGeometry(loopPath(path, Math.min(360, endDegrees - startDegrees) * Math.PI / 180, sides, pitch)).moveX(pitch * startDegrees / 360));
      }
    }
  }
  return assemble(...solids);
};

const LoopMethod = function (...args) { return Loop(this, ...args); };
Shape.prototype.Loop = LoopMethod;

export default Loop;
