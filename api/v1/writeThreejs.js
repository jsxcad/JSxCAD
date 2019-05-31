import { Shape } from './Shape';
import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  return writeFile({ geometry, preview: true }, path, toThreejsPage(options, shape.toDisjointGeometry()));
};

const method = function (options = {}) { return writeThreejsPage(options, this); };

Shape.prototype.writeThreejsPage = method;
