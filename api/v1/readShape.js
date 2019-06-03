import { Shape } from './Shape';
import { readFile } from '@jsxcad/sys';
import { writeShape } from './writeShape';

/**
 *
 * # Read Shape Geometry
 *
 * This reads tagged geometry in json format and produces a shape.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * writeShape({ path: 'geometry/cube' }, cube())
 * readShape({ path: 'geometry/cube' })
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
 * readShape({ path: 'geometry/sphere' }, () => sphere())
 * readShape({ path: 'geometry/sphere' }, () => sphere())
 * ```
 * :::
 *
 **/

export const readShape = async (options, build) => {
  const { ephemeral, path } = options;
  const data = await readFile({ as: 'utf8', ...options }, path);
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
