import { scale, translate } from '@jsxcad/geometry-eager';

import { create } from 'fontkit';
import { fromSvgPath } from '@jsxcad/convert-svg';
import { union } from '@jsxcad/geometry-z0surface';

export const toFont = ({ name }, bytes) => {
  const fontData = create(Buffer.from(bytes), name);

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
