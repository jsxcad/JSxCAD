import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { transform } from './transform.js';

export const scale = ([x = 1, y = 1, z = 1], paths) =>
  transform(fromScaling([x, y, z]), paths);
export const translate = ([x = 0, y = 0, z = 0], paths) =>
  transform(fromTranslation([x, y, z]), paths);
