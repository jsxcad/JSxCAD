import { Shape } from './jsxcad-api-shape.js';
import { read } from './jsxcad-sys.js';
import { toFont } from './jsxcad-algorithm-text.js';

const toEmSizeFromMm = (mm) => mm * 1.5;

const cache = new Map();

const readFont = async (path) => {
  if (!cache.has(path)) {
    let data = await read(`source/${path}`, { sources: [path] });
    const font = toFont({ path }, data);
    cache.set(path, font);
  }
  return cache.get(path);
};

const Text = Shape.registerMethod(
  'Text',
  (path, text, size = 10) =>
    async (shape) => {
      const font = await readFont(path);
      return Shape.fromGeometry(font({ emSize: toEmSizeFromMm(size) }, text));
    }
);

export { Text, readFont };
