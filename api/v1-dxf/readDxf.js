import Shape from '@jsxcad/api-v2';
import { fromDxf } from '@jsxcad/convert-dxf';
import { read } from '@jsxcad/sys';

export const readDxf = async (path) => {
  let data = await read(`source/${path}`, { doSerialize: false });
  if (data === undefined) {
    data = await read(`cache/${path}`, { sources: [path] });
  }
  return Shape.fromGeometry(await fromDxf(data));
};

export default readDxf;
