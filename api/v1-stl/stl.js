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
import { toStl } from '@jsxcad/convert-stl';

export const prepareStl = (shape, name, options = {}) => {
  const { path } = getSourceLocation();
  const { op = (s) => s } = options;
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const stlPath = `stl/${path}/${generateUniqueId()}`;
    const op = async () => {
      try {
        await write(stlPath, await toStl(entry, options));
      } catch (error) {
        getPendingErrorHandler()(error);
      }
    };
    addPending(op());
    entries.push({
      path: stlPath,
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
  const hash = hashSum({ name }) + hashGeometry(shape.toGeometry());
  emit({ download, hash });
  return shape;
};

Shape.registerMethod('stl', stl);
