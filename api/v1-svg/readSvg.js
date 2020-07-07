import Shape from '@jsxcad/api-v1-shape';
import { fromSvg } from '@jsxcad/convert-svg';
import { readFile } from '@jsxcad/sys';

export const readSvg = async (path, { src = path } = {}) => {
  let data = await readFile({ doSerialize: false }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ decode: 'utf8', sources: [src] }, `cache/${path}`);
  }
  if (data === undefined) {
    data = await readFile(
      { doSerialize: false, decode: 'utf8' },
      `output/${path}`
    );
  }
  if (data === undefined) {
    throw Error(`Cannot find ${path}`);
  }
  return Shape.fromGeometry(await fromSvg(data));
};

export default readSvg;
