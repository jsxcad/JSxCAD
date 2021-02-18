import { fromOff as fromOff$1, fromOffSync } from './jsxcad-convert-off.js';
import Shape from './jsxcad-api-v1-shape.js';
import { read } from './jsxcad-sys.js';

const fromOff = async (data) =>
  Shape.fromGeometry(await fromOff$1(data));

Shape.fromOff = (data) =>
  Shape.fromGeometry(fromOffSync(new TextEncoder('utf8').encode(data)));

const readOff = async (path, { src } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromOff$1(data));
};

const api = {
  fromOff,
  readOff,
};

export default api;
export { fromOff, readOff };
