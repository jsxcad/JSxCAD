import { loadSync } from 'opentype.js';
import { svgPathToPaths } from '@jsxcad/algorithm-svg';

export const pathnameToFont = (pathname) => loadSync(pathname);

export const textToSurfaces = ({ curveSegments, font, size, kerning = true, features = undefined, hinting = false },
                               text) => {
  const options = { kerning: kerning, features: features, hinting: hinting };
  const svgPaths = [];
  font.forEachGlyph(text, 0, 0, size, options,
                    (glyph, x, y, fontSize) => {
                      svgPaths.push(glyph.getPath(x, y, fontSize, options, this).toPathData());
                    });
  return svgPaths.map(svgPath => svgPathToPaths({ curveSegments: curveSegments }, svgPath));
};
