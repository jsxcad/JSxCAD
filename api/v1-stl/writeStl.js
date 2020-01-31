import Shape from '@jsxcad/api-v1-shape';
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

export const writeStl = async (shape, path, options = {}) => {
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toStl(geometry, options));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (...args) { return writeStl(this, ...args); };
Shape.prototype.writeStl = method;

export default writeStl;
