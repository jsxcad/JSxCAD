import Shape from './Shape.js';
import { repair as repairGeometry } from '@jsxcad/geometry';

export const repair = Shape.registerMethod3(
  'repair',
  ['inputGeometry', 'strings'],
  repairGeometry
);
