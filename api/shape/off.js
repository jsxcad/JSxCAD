import Shape from './Shape.js';
import { fromOff } from '@jsxcad/convert-off';

export const Off = Shape.registerMethod3('Off', ['string'], async (text) =>
  fromOff(new TextEncoder('utf8').encode(text))
);
