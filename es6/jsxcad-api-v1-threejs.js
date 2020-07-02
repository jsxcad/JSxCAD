import Shape from './jsxcad-api-v1-shape.js';
import { toThreejsPage } from './jsxcad-convert-threejs.js';
import { writeFile } from './jsxcad-sys.js';

const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile(
    { doSerialize: false },
    `output/${path}`,
    toThreejsPage(options, geometry)
  );
  await writeFile({}, `geometry/${path}`, geometry);
};

const method = function (options = {}) {
  return writeThreejsPage(options, this);
};

Shape.prototype.writeThreejsPage = method;

const api = { writeThreejsPage };

export default api;
