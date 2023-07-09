import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';

export const image = Shape.registerMethod3(
  'image',
  ['inputGeometry', 'string'],
  (geometry, url) => retag(geometry, ['image:*'], [`image:${url}`])
);
