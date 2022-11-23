import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toGcode } from '@jsxcad/convert-gcode';

export const prepareGcode = async (
  shape,
  name,
  tool,
  op = (s) => s,
  options = {}
) => {
  const { path } = getSourceLocation();
  let index = 0;
  const entries = [];
  for (const entry of await ensurePages(await op(shape))) {
    const gcodePath = `gcode/${path}/${generateUniqueId()}`;
    await write(gcodePath, await toGcode(entry, tool, options));
    entries.push({
      path: gcodePath,
      filename: `${name}_${index++}.gcode`,
      type: 'application/x-gcode',
    });
    // Produce a view of what will be downloaded.
    Shape.fromGeometry(entry).gridView(name, options.view);
  }
  return entries;
};

const gcode = Shape.registerMethod('gcode',
  (name, tool, op, options = {}) =>
  async (shape) => {
    const entries = await prepareGcode(shape, name, tool, op, options);
    const download = { entries };
    const hash =
      hashSum({ name, tool, options }) + hashGeometry(shape.toGeometry());
    emit({ download, hash });
    return shape;
  });

export default gcode;
