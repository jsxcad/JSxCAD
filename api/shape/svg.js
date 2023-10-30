import { fromSvg, toSvg } from '@jsxcad/convert-svg';
import { getSourceLocation, read, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import Shape from './Shape.js';
import { ensurePages } from '@jsxcad/geometry';

export const LoadSvg = Shape.registerMethod3(
  'LoadSvg',
  ['string', 'options'],
  async (path, { fill = true, stroke = true } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`Cannot read svg from ${path}`);
    }
    return fromSvg(data, { doFill: fill, doStroke: stroke });
  }
);

export default LoadSvg;

export const Svg = Shape.registerMethod3(
  'Svg',
  ['string', 'options'],
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return fromSvg(data, { doFill: fill, doStroke: stroke });
  }
);

export const svg = Shape.registerMethod3(
  'svg',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const svgPath = `download/svg/${path}/${id}/${viewId}`;
      await write(svgPath, await toSvg(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.svg`;
      const record = {
        path: svgPath,
        filename,
        type: 'image/svg+xml',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);
