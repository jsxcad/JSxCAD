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
  const entries = [];
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
    entries.push({
      path: stlPath,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    });
    // Produce a view of what will be downloaded.
    Shape.fromGeometry(entry).view(hashSum(name), options.view);
  }
  return entries;
};

export const stl =
  (...args) =>
  (shape) => {
    const { value: name, func: op, object: options } = destructure(args);
    const entries = prepareStl(shape, name, op, options);
    const download = { entries };
    const hash = hashSum({ name }) + hashGeometry(shape.toGeometry());
    emit({ download, hash });
    return shape;
  };

Shape.registerMethod('stl', stl);
