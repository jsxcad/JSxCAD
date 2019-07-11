import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { writeShape } from './writeShape';

/**
 *
 * # Read Shape Geometry
 *
 * This reads tagged geometry in json format and produces a shape.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await writeShape({ path: 'geometry/cube' }, cube())
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
 * await readShape({ path: 'geometry/sphere' }, () => sphere())
 * await readShape({ path: 'geometry/sphere' }, () => sphere())
 * ```
 * :::
 *
 **/

export const readShape = async (options, build) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { ephemeral, path } = options;
  const data = await readFile({ as: 'utf8', sources: getSources(path), ...options }, path);
  if (data === undefined && build !== undefined) {
    const shape = await build();
    if (!ephemeral) {
      writeShape(options, shape);
    }
    return shape;
  }
  const geometry = JSON.parse(data);
  return Shape.fromGeometry(geometry);
};
