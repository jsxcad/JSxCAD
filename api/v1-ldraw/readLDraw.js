import { fromLDraw, fromLDrawPart } from '@jsxcad/convert-ldraw';

import { Shape } from '@jsxcad/api-shape';
import { read } from '@jsxcad/sys';

export const readLDraw = async (path) => {
  const data = await read(`source/${path}`, { sources: [path] });
  return Shape.fromGeometry(await fromLDraw(data));
};

export const loadLDrawPart = async (part) =>
  Shape.fromGeometry(await fromLDrawPart(part));

export default readLDraw;
