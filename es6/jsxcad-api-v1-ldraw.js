import { fromLDraw, fromLDrawPart } from './jsxcad-convert-ldraw.js';
import { Shape } from './jsxcad-api-shape.js';
import { read } from './jsxcad-sys.js';

const ReadLDraw = Shape.registerShapeMethod(
  'ReadLDraw',
  async (path, { override, rebuild = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return Shape.fromGeometry(await fromLDraw(data, { override, rebuild }));
  }
);

const LDrawPart = Shape.registerMethod(
  'LDrawPart',
  (part, { override, rebuild = false } = {}) =>
    async (shape) =>
      Shape.fromGeometry(await fromLDrawPart(part, { override, rebuild }))
);

const LDraw = Shape.registerMethod(
  'LDraw',
  (text, { override, rebuild = false } = {}) =>
    async (shape) =>
      Shape.fromGeometry(
        await fromLDraw(new TextEncoder('utf8').encode(text), {
          override,
          rebuild,
        })
      )
);

const api = { LDraw, LDrawPart, ReadLDraw };

export { LDraw, LDrawPart, ReadLDraw, api as default };
