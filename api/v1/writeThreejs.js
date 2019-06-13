import { Shape } from './Shape';
import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path, view } = options;
  const geometry = shape.toKeptGeometry();
  await writeFile({ geometry, view, preview: true }, path, toThreejsPage(options, shape.toDisjointGeometry()));
};

const method = function (options = {}) { return writeThreejsPage(options, this); };

Shape.prototype.writeThreejsPage = method;
