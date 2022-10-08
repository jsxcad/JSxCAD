import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  addPending,
  emit,
  generateUniqueId,
  getPendingErrorHandler,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toSvg } from '@jsxcad/convert-svg';

export const prepareSvg = (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const svgPath = `download/svg/${path}/${generateUniqueId()}`;
    const render = async () => {
      try {
        await write(svgPath, await toSvg(entry, options));
      } catch (error) {
        getPendingErrorHandler()(error);
      }
    };
    addPending(render());
    const filename = `${name}_${index++}.svg`;
    const record = {
      path: svgPath,
      filename,
      type: 'image/svg+xml',
    };
    records.push(record);
    const hash =
      hashSum({ filename, options }) + hashGeometry(shape.toGeometry());
    Shape.fromGeometry(entry).gridView(hash, options.view);
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

export const svg =
  (name, op, options = {}) =>
  (shape) => {
    prepareSvg(shape, name, op, options);
    return shape;
  };

Shape.registerMethod('svg', svg);

export default svg;
