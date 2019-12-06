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

export const lathe = (shape, endDegrees = 360, { resolution = 5 }) => {
  const profile = shape.chop(Y(0));
  const outline = profile.outline();
  const solids = [];
  for (const geometry of getPaths(outline.toKeptGeometry())) {
    for (const path of geometry.paths) {
      solids.push(Shape.fromGeometry(lathePath(path, endDegrees * Math.PI / 180, resolution)));
    }
  }
  return assemble(...solids);
};

const method = function (...args) { return lathe(this, ...args); };
Shape.prototype.lathe = method;

export default lathe;
