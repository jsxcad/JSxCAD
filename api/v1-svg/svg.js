import { Shape, ensurePages, gridView } from '@jsxcad/api-shape';
import { emit, generateUniqueId, getSourceLocation, write } from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toSvg } from '@jsxcad/convert-svg';

export const prepareSvg = async (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of await ensurePages(op(shape))) {
    const svgPath = `download/svg/${path}/${generateUniqueId()}`;
    await write(svgPath, await toSvg(entry, options));
    const filename = `${name}_${index++}.svg`;
    const record = {
      path: svgPath,
      filename,
      type: 'image/svg+xml',
    };
    records.push(record);
    const hash = hashSum({ filename, options }) + hashGeometry(entry);
    await gridView(hash, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

export const svg = Shape.registerMethod(
  'svg',
  (name, op, options = {}) =>
    async (shape) => {
      await prepareSvg(shape, name, op, options);
      return shape;
    }
);

export default svg;
