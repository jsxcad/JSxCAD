/*
import { scale, translate } from '@jsxcad/geometry-eager';

import fontkit from 'fontkit/index.js';
import { fromSvgPath } from '@jsxcad/convert-svg';
import { union } from '@jsxcad/geometry-z0surface';

export const toFont = ({ name }, bytes) => {
  const fontData = fontkit.create(Buffer.from(bytes), name);

  const font = ({ emSize = 1 }, text) => {
    const { glyphs, positions } = fontData.layout(text);
    const pathsets = [];
    const factor = emSize / fontData.unitsPerEm;
    let xOffset = 0;
    for (let nth = 0; nth < glyphs.length; nth++) {
      const { path } = glyphs[nth];
      const { xAdvance } = positions[nth];
      pathsets.push(translate([xOffset], fromSvgPath({ curveSegments: 32, normalizeCoordinateSystem: false }, path.toSVG())).paths);
      xOffset += xAdvance;
    }
    return scale([factor, factor, factor], { z0Surface: union(...pathsets) });
  };
  return font;
};
*/

import { fromSvgPath } from '@jsxcad/convert-svg';
import { parse } from 'opentype.js';
import { scale } from '@jsxcad/geometry-eager';
import { union } from '@jsxcad/geometry-z0surface';

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
      pathsets.push(paths);
    }
    return scale([factor, factor, factor], { z0Surface: union(...pathsets) });
  };

  return font;
};
