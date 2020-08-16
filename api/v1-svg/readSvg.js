import Shape from '@jsxcad/api-v1-shape';
import { fromSvg } from '@jsxcad/convert-svg';
import { read } from '@jsxcad/sys';

export const readSvg = async (path) => {
  const data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read svg from ${path}`);
  }
  return Shape.fromGeometry(await fromSvg(data));
};

export default readSvg;
