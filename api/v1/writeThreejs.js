import { Shape } from './shape';
import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  return writeFile({ geometry, preview: true }, path, toThreejsPage(options, shape.toDisjointGeometry()));
};

const method = function (options = {}) { writeThreejsPage(options, this); return this; };

Shape.prototype.writeThreejsPage = method;
