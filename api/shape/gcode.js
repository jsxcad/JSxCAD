import { getSourceLocation, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import { Shape } from './Shape.js';
import { ensurePages } from '@jsxcad/geometry';
import { toGcode } from '@jsxcad/convert-gcode';

export const gcode = Shape.registerMethod3(
  'gcode',
  ['inputGeometry', 'string', 'function', 'options'],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    { speed = 0, feedrate = 0, jumpHeight = 1, view = {} } = {}
  ) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const gcodePath = `download/gcode/${path}/${id}/${viewId}`;
      await write(
        gcodePath,
        await toGcode(entry, { speed, feedrate, jumpHeight })
      );
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.gcode`;
      const record = {
        path: gcodePath,
        filename,
        type: 'application/x+gcode',
      };
      await gridView(name, {
        ...view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);
