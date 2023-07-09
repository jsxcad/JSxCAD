import { computeHash, emit, getSourceLocation, write } from '@jsxcad/sys';
import { ensurePages, hash as hashGeometry } from '@jsxcad/geometry';
import { gridView, qualifyViewId } from './view.js';

import { Shape } from './Shape.js';
import { toGcode } from '@jsxcad/convert-gcode';

// If we have a preprocessing step we could more easily handle await Shape.apply(input, op).
export const gcode = Shape.registerMethod3(
  'gcode',
  ['input', 'string', 'function', 'options'],
  () => undefined,
  async (
    _,
    [
      input,
      name,
      op = (s) => s,
      { speed = 0, feedrate = 0, jumpHeight = 1 } = {},
    ]
  ) => {
    const options = { speed, feedrate, jumpHeight };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedInput = await Shape.apply(input, op);
    for (const entry of ensurePages(await updatedInput.toGeometry())) {
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
