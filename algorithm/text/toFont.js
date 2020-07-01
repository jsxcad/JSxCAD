import { reorient, union } from '@jsxcad/geometry-z0surface-boolean';

import { fromSvgPath } from '@jsxcad/convert-svg';
import { parse } from 'opentype.js';
import { scale } from '@jsxcad/geometry-tagged';

export const toFont = (options = {}, data) => {
  // Unfortunately opentype.js wants a buffer but doesn't take an offset.
  // Trim the buffer back so that we get one where offset 0 is the start of data.
  const fontData = parse(data.buffer.slice(data.byteOffset));

  const font = (options, text) => {
    const {
      emSize = 1,
      curveSegments = 32,
      size = 72,
      kerning = true,
      features,
      hinting = false,
    } = options;
    const renderingOptions = { kerning, features, hinting };
    const svgPaths = [];
    const factor = (emSize * 10) / fontData.unitsPerEm;
    fontData.forEachGlyph(
      text,
      0,
      0,
      size,
      renderingOptions,
      (glyph, x, y, fontSize) => {
        svgPaths.push(glyph.getPath(x, y, fontSize, options).toPathData());
      }
    );
    const pathsets = [];
    for (let { paths } of svgPaths.map((svgPath) =>
      fromSvgPath(new TextEncoder('utf8').encode(svgPath), {
        curveSegments: curveSegments,
      })
    )) {
      // Outlining forces re-orientation.
      pathsets.push(reorient(paths));
    }
    return scale([factor, factor, factor], { type: 'z0Surface', z0Surface: union(...pathsets) });
  };

  return font;
};
