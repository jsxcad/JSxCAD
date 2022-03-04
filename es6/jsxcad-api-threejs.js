import { fromThreejsToGeometry, fromSvgToThreejs } from './jsxcad-convert-threejs.js';
import { Shape } from './jsxcad-api-shape.js';
import { read } from './jsxcad-sys.js';

const readSvg = async (path, { src, invert = false } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(
    await fromThreejsToGeometry(await fromSvgToThreejs(data))
  );
};

const api = {
  readSvg,
};

export { api as default, readSvg };
