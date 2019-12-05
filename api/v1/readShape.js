import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { cacheShape } from './writeShape';

/**
 *
 * # Read Shape Geometry
 *
 * This reads tagged geometry in json format and produces a shape.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape({ path: 'geometry/cube' })
 * await readShape({ path: 'geometry/cube' })
 * ```
 * :::
 *
 * A shape building function can be supplied to generate the shape to read if absent.
 *
 * The second read will not call the build function, and it will be present in re-runs.
 *
 * This allows the caching of complex geometry for fast recomposition.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await readShape({ path: 'geometry/sphere' }, () => Sphere())
 * await readShape({ path: 'geometry/sphere' }, () => Sphere())
 * ```
 * :::
 *
 **/

export const readShape = async (options, build) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { ephemeral, path } = options;

  let data = await readFile({ as: 'utf8', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'utf8', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }

  if (data === undefined && build !== undefined) {
    const shape = await build();
    if (!ephemeral) {
      await cacheShape(options, shape);
    }
    return shape;
  }
  const geometry = JSON.parse(data);
  return Shape.fromGeometry(geometry);
};
