import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';

export const version = Shape.registerMethod3(
  ['version', 'v'],
  ['inputGeometry', 'value'],
  (geometry, version = 0) =>
    retag(geometry, [`part:version=*`], [`part:version=${version}`])
);

export const v = version;
