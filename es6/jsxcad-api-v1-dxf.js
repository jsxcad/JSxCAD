import { readFile, getSources, writeFile } from './jsxcad-sys.js';
import Shape from './jsxcad-api-v1-shape.js';
import { fromDxf, toDxf } from './jsxcad-convert-dxf.js';

const readDxf = async (options) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  let data = await readFile({ doSerialize: false, ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  return Shape.fromGeometry(await fromDxf(options, data));
};

/**
 *
 * # Write DXF
 *
 * ```
 * Cube().section().writeDxf('cube.dxf');
 * ```
 *
 **/

const writeDxf = async (options, shape) => {
  if (typeof options === 'string') {
    // Support writeDxf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const dxf = await toDxf({ preview: true, ...options }, geometry);
  await writeFile({ doSerialize: false }, `output/${path}`, dxf);
  await writeFile({}, `geometry/${path}`, geometry);
};

const method = function (options = {}) { return writeDxf(options, this); };
Shape.prototype.writeDxf = method;

const api = { readDxf, writeDxf };

export default api;
export { readDxf, writeDxf };
