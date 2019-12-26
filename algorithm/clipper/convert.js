import ClipperLib from 'clipper-lib';

import { assertGood, measureArea } from '@jsxcad/geometry-path';
const { IntPoint } = ClipperLib;

const toInt = (integer) => integer * 1e7;
const toFloat = (integer) => integer / 1e7;

export const fromSurface = (surface, normalize) => surface.map(path => path.map(point => { const [X, Y] = normalize(point); return new IntPoint(toInt(X), toInt(Y)); }));
export const toSurface = (paths, normalize) => {
  const result = paths.map(path => path.map(({ X, Y }) => { return normalize([toFloat(X), toFloat(Y)]); }));
  for (const path of result) {
    const area = measureArea(path);
    // assertGood(path);
  }
  return result;
}
