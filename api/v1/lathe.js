import { Shape } from './Shape';
import { Y } from './Y';
import { assemble } from './assemble';
import { getPaths } from '@jsxcad/geometry-tagged';
import { lathe as lathePath } from '@jsxcad/algorithm-shape';

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

export const lathe = ({ sides = 16, loops = 1, loopOffset = 0 }, shape) => {
  const profile = shape.cut(Y(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      solids.push(Shape.fromGeometry(lathePath(path, sides, loops, loopOffset)));
    }
  }
  return assemble(...solids);
};

const method = function (options) { return lathe(options, this); };

Shape.prototype.lathe = method;
