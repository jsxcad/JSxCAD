import { loadSync } from 'opentype.js';
import { svgPathToPaths } from '@jsxcad/algorithm-svg';

export const pathnameToFont = (pathname) => loadSync(pathname);

export const textToPaths = ({ font, size, kerning = true, features = undefined, hinting = false }, text) =>
  svgPathToPaths({}, font.getPath(text, 0, 0, size, { kerning: kerning, features: features, hinting: hinting }).toPathData());
