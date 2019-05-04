import { fromSvgPath } from '@jsxcad/convert-svg';
import { loadSync } from 'opentype.js';
import { union } from '@jsxcad/geometry-z0surface';

export const pathnameToFont = (pathname) => loadSync(pathname);

export const textToSurfaces = ({ curveSegments, font, size, kerning = true, features = undefined, hinting = false },
                               text) => {
  const options = { kerning: kerning, features: features, hinting: hinting };
  const svgPaths = [];
  font.forEachGlyph(text, 0, 0, size, options,
                    (glyph, x, y, fontSize) => {
                      svgPaths.push(glyph.getPath(x, y, fontSize, options).toPathData());
                    });
  const pathsets = [];
  for (let { paths } of svgPaths.map(svgPath => fromSvgPath({ curveSegments: curveSegments }, svgPath))) {
    pathsets.push(paths);
  }
  return { z0Surface: union(...pathsets) };
};
