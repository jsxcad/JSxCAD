import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  addPending,
  emit,
  getDefinitions,
  getPendingErrorHandler,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toPdf } from '@jsxcad/convert-pdf';

export const preparePdf = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    const op = toPdf(entry, {
      definitions: getDefinitions(),
      ...options,
    }).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.pdf`,
      type: 'application/pdf',
    });
  }
  return entries;
};

const pdf =
  (name, options = {}) =>
  (shape) => {
    const entries = preparePdf(this, name, options);
    const download = { entries };
    const hash = hashSum({ name, options }) + hashGeometry(this.toGeometry());
    emit({ download, hash });
    return this;
  };

Shape.registerMethod('pdf', pdf);
