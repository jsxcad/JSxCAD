import { computeHash, emit, getSourceLocation, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import { Shape } from './Shape.js';
import { ensurePages } from './Page.js';
import { hash as hashGeometry } from '@jsxcad/geometry';
import { toGcode } from '@jsxcad/convert-gcode';

export const gcode = Shape.registerMethod2(
  'gcode',
  ['input', 'string', 'function', 'options'],
  async (
    input,
    name,
    op = (s) => s,
    { speed = 0, feedrate = 0, jumpHeight = 1 } = {}
  ) => {
    const options = { speed, feedrate, jumpHeight };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    for (const entry of await ensurePages(await Shape.apply(input, op))) {
      const gcodePath = `download/gcode/${path}/${id}/${viewId}`;
      await write(gcodePath, await toGcode(entry, {}, options));

      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.gcode`;
      const record = {
        path: gcodePath,
        filename,
        type: 'application/x-gcode',
      };
      // Produce a view of what will be downloaded.
      const hash = computeHash({ filename, options }) + hashGeometry(entry);
      await gridView(name, options.view)(Shape.fromGeometry(entry));
      emit({ download: { entries: [record] }, hash });
    }
    return input;
  }
);
