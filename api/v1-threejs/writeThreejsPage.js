import Shape from '@jsxcad/api-v1-shape';
import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({}, `output/${path}`, toThreejsPage(options, geometry));
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeThreejsPage(options, this); };

Shape.prototype.writeThreejsPage = method;

export default writeThreejsPage;