import { assertNumber } from './assert';
import { hslToRgb } from '@jsxcad/algorithm-color';

export const hsl2rgb = (...params) => {
  try {
    const [hue, saturation, brightness] = params;
    assertNumber(hue);
    assertNumber(saturation);
    assertNumber(brightness);
    return hslToRgb([hue, saturation, brightness]);
  } catch (e) {}

  try {
    const [hue, saturation, brightness] = params[0];
    return hslToRgb([hue, saturation, brightness]);
  } catch (e) {}

  throw Error(`Unsupported interface for hsl2rgb: ${JSON.stringify(params)}`);
};
