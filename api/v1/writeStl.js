import { Shape } from './Shape';
import { toStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write STL
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await cube().writeStl('cube.stl');
 * await readStl({ path: 'cube.stl' });
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await writeStl({ path: 'cube.stl' }, cube());
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
  await writeFile({ preview: true, geometry }, path, toStl(options, geometry));
};

const method = function (options = {}) { return writeStl(options, this); };

Shape.prototype.writeStl = method;
