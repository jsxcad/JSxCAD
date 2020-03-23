import Shape from '@jsxcad/api-v1-shape';
import { toGcode } from '@jsxcad/convert-gcode';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write G-Code
 *
 * ```
 * Square().toolpath(0.5).writeGcode('cube.pdf');
 * ```
 *
 **/

export const writeGcode = async (options, shape) => {
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

export default writeGcode;
