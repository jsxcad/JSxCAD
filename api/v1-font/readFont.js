import { Shape } from '@jsxcad/api-shape';
import { read } from '@jsxcad/sys';
import { toFont } from '@jsxcad/algorithm-text';

const toEmSizeFromMm = (mm) => mm * 1.5;

const cache = new Map();

export const readFont = async (path) => {
  if (!cache.has(path)) {
    let data = await read(`source/${path}`, { sources: [path] });
    const font = toFont({ path }, data);
    cache.set(path, font);
  }
  return cache.get(path);
};

export const Text = Shape.registerShapeMethod(
  'Text',
  async (path, text, size = 10) => {
    const font = await readFont(path);
    return Shape.fromGeometry(font({ emSize: toEmSizeFromMm(size) }, text));
  }
);

export default readFont;
