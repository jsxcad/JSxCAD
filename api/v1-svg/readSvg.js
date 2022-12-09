import { Shape } from '@jsxcad/api-shape';
import { fromSvg } from '@jsxcad/convert-svg';
import { read } from '@jsxcad/sys';

export const LoadSvg = Shape.registerShapeMethod(
  'LoadSvg',
  async (path, { fill = true, stroke = true } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`Cannot read svg from ${path}`);
    }
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

export default LoadSvg;

export const Svg = Shape.registerShapeMethod(
  'Svg',
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);
