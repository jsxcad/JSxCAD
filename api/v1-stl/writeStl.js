import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  addPending,
  emit,
  generateUniqueId,
  getModule,
  getPendingErrorHandler,
  write,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toStl } from '@jsxcad/convert-stl';

export const prepareStl = (shape, name, options = {}) => {
  const { op = (s) => s } = options;
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const path = `stl/${getModule()}/${generateUniqueId()}`;
    const op = toStl(entry, options)
      .then((data) => write(path, data))
      .catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      // data: op,
      path,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    });
    // Produce a view of what will be downloaded.
    Shape.fromGeometry(entry).view(options.view);
  }
  return entries;
};

export const stl = (name, options) => (shape) => {
  const entries = prepareStl(shape, name, options);
  const download = { entries };
  // We should be saving the stl data in the filesystem.
  const hash = hashSum({ name }) + hashGeometry(shape.toGeometry());
  emit({ download, hash });
  return shape;
};

Shape.registerMethod('stl', stl);
