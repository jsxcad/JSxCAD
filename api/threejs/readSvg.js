import {
  fromSvgToThreejs,
  fromThreejsToGeometry,
} from '@jsxcad/convert-threejs';

import { Shape } from '@jsxcad/api-shape';
import { read } from '@jsxcad/sys';

export const ThreejsSvg = Shape.registerMethod(
  'ThreejsSvg',
  (path, { src, invert = false } = {}) =>
    async (shape) => {
      const data = await read(`source/${path}`, { sources: [path] });
      return Shape.fromGeometry(
        await fromThreejsToGeometry(await fromSvgToThreejs(data))
      );
    }
);

export default ThreejsSvg;
