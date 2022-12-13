import { fromLDraw, fromLDrawPart } from '@jsxcad/convert-ldraw';

import { Shape } from '@jsxcad/api-shape';
import { read } from '@jsxcad/sys';

export const ReadLDraw = Shape.registerShapeMethod(
  'ReadLDraw',
  async (path, { override, rebuild = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return Shape.fromGeometry(await fromLDraw(data, { override, rebuild }));
  }
);

export const LDrawPart = Shape.registerShapeMethod(
  'LDrawPart',
  async (part, { override, rebuild = false } = {}) =>
    Shape.fromGeometry(await fromLDrawPart(part, { override, rebuild }))
);

export const LDraw = Shape.registerShapeMethod(
  'LDraw',
  async (text, { override, rebuild = false } = {}) =>
    Shape.fromGeometry(
      await fromLDraw(new TextEncoder('utf8').encode(text), {
        override,
        rebuild,
      })
    )
);
