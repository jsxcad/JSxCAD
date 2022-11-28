import { fromThreejsToGeometry, fromColladaToThreejs, fromSvgToThreejs } from './jsxcad-convert-threejs.js';
import { Shape } from './jsxcad-api-shape.js';
import { read } from './jsxcad-sys.js';

const ThreejsCollada = Shape.registerShapeMethod(
  'ThreejsCollada',
  async (path, { src, invert = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return Shape.fromGeometry(
      await fromThreejsToGeometry(await fromColladaToThreejs(data))
    );
  }
);

const ThreejsSvg = Shape.registerShapeMethod(
  'ThreejsSvg',
  async (path, { src, invert = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return Shape.fromGeometry(
      await fromThreejsToGeometry(await fromSvgToThreejs(data))
    );
  }
);

const api = {
  ThreejsCollada,
  ThreejsSvg,
};

export { ThreejsCollada, ThreejsSvg, api as default };
