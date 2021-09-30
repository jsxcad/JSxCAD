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
  const entries = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const svgPath = `svg/${path}/${generateUniqueId()}`;
    const render = async () => {
      try {
        await write(svgPath, await toSvg(entry, options));
      } catch (error) {
        getPendingErrorHandler()(error);
      }
    };
    addPending(render());
    entries.push({
      path: svgPath,
      filename: `${name}_${index++}.svg`,
      type: 'image/svg+xml',
    });
    Shape.fromGeometry(entry).view(options.view);
  }
  return entries;
};

export const svg =
  (name, op, options = {}) =>
  (shape) => {
    const entries = prepareSvg(shape, name, op, options);
    const download = { entries };
    const hash = hashSum({ name, options }) + hashGeometry(shape.toGeometry());
    emit({ download, hash });
    return shape;
  };

Shape.registerMethod('svg', svg);

export default svg;
