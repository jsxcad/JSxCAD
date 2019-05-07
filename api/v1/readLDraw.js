import { Shape } from './Shape';
import { fromLDraw } from '@jsxcad/convert-ldraw';

export const readLDraw = async (options) => {
  return Shape.fromGeometry(await fromLDraw(options));
};
