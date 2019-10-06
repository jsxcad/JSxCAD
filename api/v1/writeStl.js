import { Shape } from './Shape';
import { toStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write STL
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeStl('cube.stl');
 * await readStl({ path: 'cube.stl' });
 * ```
 * :::
 *
 **/

export const writeStl = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `file/${path}`, toStl(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeStl(options, this); };

Shape.prototype.writeStl = method;
