import Shape from './Shape.js';
import { separate as op } from '@jsxcad/geometry';

export const noHoles = Shape.registerMethod3(
  'noHoles',
  ['inputGeometry'],
  (geometry) => op(geometry, { noHoles: true })
);
