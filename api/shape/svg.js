import {
  computeHash,
  emit,
  generateUniqueId,
  getSourceLocation,
  read,
  write,
} from '@jsxcad/sys';
import { fromSvg, toSvg } from '@jsxcad/convert-svg';

import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { ensurePages } from './Page.js';
import { gridView } from './view.js';
import { hash as hashGeometry } from '@jsxcad/geometry';

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

export const svg = Shape.registerMethod('svg', (...args) => async (shape) => {
  const {
    value: name,
    func: op = (s) => s,
    object: options = {},
  } = destructure(args);
  const { path } = getSourceLocation();
  let index = 0;
  for (const entry of await ensurePages(op(shape))) {
    const svgPath = `download/svg/${path}/${generateUniqueId()}`;
    await write(svgPath, await toSvg(entry, options));
    const filename = `${name}_${index++}.svg`;
    const record = {
      path: svgPath,
      filename,
      type: 'image/svg+xml',
    };
    const hash = computeHash({ filename, options }) + hashGeometry(entry);
    await gridView(hash, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash });
  }
  return shape;
});
