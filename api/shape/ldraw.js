import { fromLDraw, fromLDrawPart } from '@jsxcad/convert-ldraw';

import { Shape } from './Shape.js';
import { read } from '@jsxcad/sys';

export const LoadLDraw = Shape.registerMethod3(
  'LoadLDraw',
  ['string', 'options'],
  async (path, { override, rebuild = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return fromLDraw(data, { override, rebuild });
  }
);

export const LDrawPart = Shape.registerMethod3(
  'LDrawPart',
  ['string', 'options'],
  (part, { override, rebuild = false } = {}) =>
    fromLDrawPart(part, { override, rebuild })
);

export const LDraw = Shape.registerMethod3(
  'LDraw',
  ['string', 'options'],
  (text, { override, rebuild = false } = {}) =>
    fromLDraw(new TextEncoder('utf8').encode(text), {
      override,
      rebuild,
    })
);
