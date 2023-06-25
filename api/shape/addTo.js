import Shape from './Shape.js';
import { joinTo } from '@jsxcad/geometry';

export const addTo = Shape.registerMethod3(
  ['addTo', 'joinTo'],
  ['inputGeometry', 'geometry', 'modes:exact,noVoid'],
  joinTo
);
