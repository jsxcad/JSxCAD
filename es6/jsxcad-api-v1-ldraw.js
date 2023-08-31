import { fromLDraw, fromLDrawPart } from './jsxcad-convert-ldraw.js';
import { Shape } from './jsxcad-api-shape.js';
import { read } from './jsxcad-sys.js';

const ReadLDraw = Shape.registerShapeMethod3(
  'ReadLDraw',
  ['string', 'options'],
  async (path, { override, rebuild = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return fromLDraw(data, { override, rebuild });
  }
);

const LDrawPart = Shape.registerMethod3(
  'LDrawPart',
  ['string', 'options'],
  (part, { override, rebuild = false } = {}) =>
      fromLDrawPart(part, { override, rebuild })
);

const LDraw = Shape.registerMethod3(
  'LDraw',
  ['string', 'options'],
  (text, { override, rebuild = false } = {}) =>
        fromLDraw(new TextEncoder('utf8').encode(text), {
          override,
          rebuild,
        })
);

const api = { LDraw, LDrawPart, ReadLDraw };

export { LDraw, LDrawPart, ReadLDraw, api as default };
