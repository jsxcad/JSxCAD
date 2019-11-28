import { Shape } from './Shape';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write Shape Geometry
 *
 * This writes a shape as a tagged geometry in json format.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape('cube.shape');
 * await readShape({ path: 'cube.shape' })
 * ```
 * :::
 *
 **/

export const cacheShape = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toGeometry();
  await writeFile({}, `cache/${path}`, JSON.stringify(geometry));
};

export const writeShape = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toGeometry();
  await writeFile({}, `output/${path}`, JSON.stringify(geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeShape(options, this); };

Shape.prototype.writeShape = method;
