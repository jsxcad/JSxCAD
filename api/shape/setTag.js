import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';

export const setTag = Shape.registerMethod3(
  'setTag',
  ['inputGeometry', 'string', 'value'],
  (geometry, tag, value) => retag(geometry, [`${tag}=*`], [`${tag}=${value}`])
);

export default setTag;
