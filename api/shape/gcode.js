import { computeHash, emit, getSourceLocation, write } from '@jsxcad/sys';
import { gridView, qualifyViewId } from './view.js';

import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { hash as hashGeometry } from '@jsxcad/geometry';
import { toGcode } from '@jsxcad/convert-gcode';

export const gcode = Shape.registerMethod(
  'gcode',
  (...args) =>
    async (shape) => {
      const {
        value: name,
        func: op = (s) => s,
        object: options = {},
      } = destructure(args);
      const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
      let index = 0;
      // Gcode doesn't do layout (although maybe it should)
      const entry = await op(shape).toGeometry();
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
      return shape;
    }
);
