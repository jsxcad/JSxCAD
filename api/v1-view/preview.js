import '@jsxcad/api-v1-plans';

import { Layers } from '@jsxcad/api-v1-shapes';
import Shape from '@jsxcad/api-v1-shape';
import { writeFile } from '@jsxcad/sys';

export const preview = async (shape, name = 'preview', { width, height, view } = {}) => {
  const output = Layers(...shape.leafs(l => l.Page())).Page().toKeptGeometry();
  return writeFile({}, `geometry/${name}`, JSON.stringify(output.item.content));
};

const previewMethod = function (...args) { return preview(this, ...args); };
Shape.prototype.preview = previewMethod;

export default preview;
