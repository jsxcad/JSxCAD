import { Shape } from './Shape.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = Shape.registerMethod2(
  'outline',
  ['inputGeometry', 'geometries'],
  (geometry, selections) =>
    Shape.fromGeometry(outlineGeometry(geometry, selections))
);
