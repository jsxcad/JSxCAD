import {
  fromColladaToThreejs,
  fromThreejsToGeometry,
} from '@jsxcad/convert-threejs';

import { Shape } from '@jsxcad/api-shape';
import { read } from '@jsxcad/sys';

export const readCollada = async (path, { src, invert = false } = {}) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(
    await fromThreejsToGeometry(await fromColladaToThreejs(data))
  );
};

export default readCollada;