import { union } from '@jsxcad/geometry-z0surface';

import { assertGood } from '@jsxcad/geometry-surface';
import { fromSvgPath } from '@jsxcad/convert-svg';
import { parse } from 'opentype.js';
import { scale } from '@jsxcad/geometry-tagged';

export const toFont = (options = {}, bytes) => {
  const fontData = parse(bytes.buffer);

  const font = (options, text) => {
    const { emSize = 1, curveSegments = 32, size = 72, kerning = true, features, hinting = false } = options;
    const renderingOptions = { kerning, features, hinting };
    const svgPaths = [];
    const factor = emSize * 10 / fontData.unitsPerEm;
    fontData.forEachGlyph(text, 0, 0, size, renderingOptions,
                          (glyph, x, y, fontSize) => {
                            svgPaths.push(glyph.getPath(x, y, fontSize, options).toPathData());
                          });
    const pathsets = [];
    for (let { paths } of svgPaths.map(svgPath => fromSvgPath({ curveSegments: curveSegments }, svgPath))) {
      // Cleaning forces the first path to not be a hole.
      assertGood(paths);
      for (const path of paths) {
        if (path[0] === null) {
          // Paths should be closed.
          throw Error('die');
        }
      }
      pathsets.push(paths);
    }
    return scale([factor, factor, factor], { z0Surface: union(...pathsets) });
  };

  return font;
};
