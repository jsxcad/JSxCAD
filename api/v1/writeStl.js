import { Shape } from './Shape';
import { toStl } from '@jsxcad/convert-stl';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write STL
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * cube().writeStl({ path: 'cube.stl' });
 * readStl({ path: 'cube.stl' });
 * ```
 * :::
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * writeStl({ path: 'cube.stl' }, cube());
 * readStl({ path: 'cube.stl' });
 * ```
 * :::
 *
 **/

export const writeStl = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry(options);
  return writeFile({ preview: true, geometry }, path, toStl(options, geometry));
};

const method = function (options = {}) { writeStl(options, this); return this; };

Shape.prototype.writeStl = method;
