import Shape from './Shape.js';
import { link as linkOp } from '@jsxcad/geometry';

export const Link = Shape.registerMethod3(
  'Link',
  ['geometry', 'geometries', 'modes:close,reverse'],
  linkOp
);

export default Link;

export const link = Shape.registerMethod3(
  'link',
  ['inputGeometry', 'geometries', 'modes:close,reverse'],
  linkOp
);
