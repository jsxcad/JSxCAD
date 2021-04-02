import {
  addPending,
  emit,
  getDefinitions,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-shapes';
import { hash as hashGeometry } from '@jsxcad/geometry-tagged';
import hashSum from 'hash-sum';
import { toPdf } from '@jsxcad/convert-pdf';

/*
export const preparePdf = (shape, name, { lineWidth = 0.096 } = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const { size } = entry.layout;
    const op = convertToPdf(entry, { lineWidth, size }).catch(
      getPendingErrorHandler()
    );
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.pdf`,
      type: 'application/pdf',
    });
  }
  return entries;
};
*/

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

const downloadPdfMethod = function (name, options = {}) {
  const entries = preparePdf(this, name, options);
  const download = { entries };
  const hash = hashSum({ name, options }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadPdf = downloadPdfMethod;
Shape.prototype.pdf = downloadPdfMethod;

export const writePdf = (shape, name, { lineWidth = 0.096 } = {}) => {
  for (const { data, filename } of preparePdf(shape, name, { lineWidth })) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return writePdf;
};

const writePdfMethod = function (...args) {
  return writePdf(this, ...args);
};
Shape.prototype.writePdf = writePdfMethod;
