import { computeHash, emit, getSourceLocation, read, write } from '@jsxcad/sys';
import { fromSvg, toSvg } from '@jsxcad/convert-svg';
import { gridView, qualifyViewId } from './view.js';

import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { ensurePages } from './Page.js';
import { hash as hashGeometry } from '@jsxcad/geometry';

export const LoadSvg = Shape.registerMethod(
  'LoadSvg',
  (path, { fill = true, stroke = true } = {}) =>
    async (shape) => {
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

export const Svg = Shape.registerMethod(
  'Svg',
  (svg, { fill = true, stroke = true } = {}) =>
    async (shape) => {
      const data = new TextEncoder('utf8').encode(svg);
      return Shape.fromGeometry(
        await fromSvg(data, { doFill: fill, doStroke: stroke })
      );
    }
);

export const svg = Shape.registerMethod('svg', (...args) => async (shape) => {
  const {
    value: name,
    func: op = (s) => s,
    object: options = {},
  } = destructure(args);
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  let index = 0;
  for (const entry of await ensurePages(op(shape))) {
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
  return shape;
});
