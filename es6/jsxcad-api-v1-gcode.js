import Shape from './jsxcad-api-v1-shape.js';
import { toGcode } from './jsxcad-convert-gcode.js';
import { writeFile } from './jsxcad-sys.js';

/**
 *
 * # Write G-Code
 *
 * ```
 * Square().toolpath(0.5).writeGcode('cube.pdf');
 * ```
 *
 **/

const writeGcode = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writeGcode('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const gcode = await toGcode({ preview: true, ...options }, geometry);
  await writeFile({ doSerialize: false }, `output/${path}`, gcode);
  await writeFile({}, `geometry/${path}`, geometry);
};

const method = function (options = {}) { return writeGcode(options, this); };
Shape.prototype.writeGcode = method;

const api = { writeGcode };

export default api;
export { writeGcode };
