import { Shape } from './Shape';
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

export const lathe = ({ sides = 16 }, shape) => {
  const [left] = shape.cut();
  const outline = left.outline();
  const polygons = [];
  for (const { paths } of getPaths(outline.toKeptGeometry())) {
    for (const path of paths) {
      polygons.push(...lathePath({ sides }, path));
    }
  }
  return Shape.fromPolygonsToSolid(polygons);
};

const method = function (options) { return lathe(options, this); };

Shape.prototype.lathe = method;
