import {
  makeConvex,
  reorient,
  union,
} from '@jsxcad/geometry-z0surface-boolean';
import { scale, taggedZ0Surface } from '@jsxcad/geometry-tagged';

import OpenTypeJs from 'opentype.js/dist/opentype.js';
import { fromSvgPath } from '@jsxcad/convert-svg';

export const toFont = (options = {}, data) => {
  // Unfortunately opentype.js wants a buffer but doesn't take an offset.
  // Trim the buffer back so that we get one where offset 0 is the start of data.
  const fontData = OpenTypeJs.parse(data.buffer.slice(data.byteOffset));

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
    return scale(
      [factor, factor, factor],
      taggedZ0Surface({}, makeConvex(union(...pathsets)))
    );
  };

  return font;
};
