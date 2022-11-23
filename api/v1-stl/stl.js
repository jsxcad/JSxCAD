import { Shape, destructure, ensurePages } from '@jsxcad/api-shape';
import {
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toStl } from '@jsxcad/convert-stl';

export const prepareStl = async (shape, name, op = (s) => s, options = {}) => {
  const { path } = getSourceLocation();
  let index = 0;
  const records = [];
  console.log(`QQ/prepareStl/shape: ${JSON.stringify(shape)}`);
  for (const entry of await ensurePages(await op(shape))) {
    const stlPath = `download/stl/${path}/${generateUniqueId()}`;
    await write(stlPath, await toStl(entry, options));
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
    Shape.fromGeometry(entry).view(name, options.view);
    emit({ download: { entries: [record] }, hash });
  }
  return records;
};

export const stl = Shape.registerMethod('stl',
  (...args) =>
  async (shape) => {
    const { value: name, func: op, object: options } = destructure(args);
    await prepareStl(shape, name, op, options);
    return shape;
  });
