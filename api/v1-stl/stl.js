import { Shape, destructure, ensurePages } from '@jsxcad/api-shape';
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
import { toStl } from '@jsxcad/convert-stl';

export const prepareStl = (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const stlPath = `download/stl/${path}/${generateUniqueId()}`;
    const render = async () => {
      try {
        await write(stlPath, await toStl(entry, options));
      } catch (error) {
        getPendingErrorHandler()(error);
      }
    };
    addPending(render());
    const filename = `${name}_${index++}.stl`;
    const record = {
      path: stlPath,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    };
    records.push(record);
    // Produce a view of what will be downloaded.
    const hash =
      hashSum({ filename, options }) + hashGeometry(shape.toGeometry());
    Shape.fromGeometry(entry).view(hash, options.view);
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

export const stl =
  (...args) =>
  (shape) => {
    const { value: name, func: op, object: options } = destructure(args);
    prepareStl(shape, name, op, options);
    return shape;
  };

Shape.registerMethod('stl', stl);
