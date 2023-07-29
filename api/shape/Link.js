import { Link as LinkOp, Points, link as linkOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Link = Shape.registerMethod3(
  'Link',
  ['geometries', 'coordinates', 'modes:close,reverse'],
  (geometries, coordinates, modes) =>
    LinkOp([...geometries, Points(coordinates)], modes)
);

export default Link;

export const link = Shape.registerMethod3(
  'link',
  ['inputGeometry', 'geometries', 'coordinates', 'modes:close,reverse'],
  (geometry, geometries, coordinates, modes) =>
    linkOp(geometry, [...geometries, Points(coordinates)], modes)
);
