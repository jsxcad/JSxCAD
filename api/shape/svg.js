import { computeHash, emit, getSourceLocation, read, write } from '@jsxcad/sys';
import { fromSvg, toSvg } from '@jsxcad/convert-svg';
import { gridView, qualifyViewId } from './view.js';

import Shape from './Shape.js';
import { ensurePages } from './Page.js';
import { hash as hashGeometry } from '@jsxcad/geometry';

export const LoadSvg = Shape.registerMethod2(
  'LoadSvg',
  ['string', 'options'],
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

export const Svg = Shape.registerMethod2(
  'Svg',
  ['string', 'options'],
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

export const svg = Shape.registerMethod2(
  'svg',
  ['input', 'string', 'function', 'options'],
  async (input, name, op = (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    for (const entry of await ensurePages(op(input))) {
      const svgPath = `download/svg/${path}/${id}/${viewId}`;
      await write(svgPath, await toSvg(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.svg`;
      const record = {
        path: svgPath,
        filename,
        type: 'image/svg+xml',
      };
      const hash = computeHash({ filename, options }) + hashGeometry(entry);
      await gridView(name, options.view)(Shape.fromGeometry(entry));
      emit({ download: { entries: [record] }, hash });
    }
    return input;
  }
);
