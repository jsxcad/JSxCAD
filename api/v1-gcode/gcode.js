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
import { toGcode } from '@jsxcad/convert-gcode';

export const prepareGcode = (
  shape,
  name,
  tool,
  op = (s) => s,
  options = {}
) => {
  const { path } = getSourceLocation();
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(op(shape).toDisjointGeometry())) {
    const gcodePath = `gcode/${path}/${generateUniqueId()}`;
    const render = async () => {
      try {
        await write(gcodePath, await toGcode(entry, tool, options));
      } catch (error) {
        getPendingErrorHandler()(error);
      }
    };
    addPending(render());
    entries.push({
      path: gcodePath,
      filename: `${name}_${index++}.gcode`,
      type: 'application/x-gcode',
    });
    // Produce a view of what will be downloaded.
    Shape.fromGeometry(entry).view(options.view);
  }
  return entries;
};

const gcode =
  (name, tool, op, options = {}) =>
  (shape) => {
    const entries = prepareGcode(shape, name, tool, op, options);
    const download = { entries };
    const hash =
      hashSum({ name, tool, options }) + hashGeometry(shape.toGeometry());
    emit({ download, hash });
    return shape;
  };

Shape.registerMethod('gcode', gcode);

export default gcode;
