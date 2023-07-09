import { Curve as CurveOp, curve as curveOp } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const Curve = Shape.registerMethod3(
  'Curve',
  ['coordinates', 'number', 'options', 'modes:closed'],
  CurveOp
);

export const curve = Shape.registerMethod3(
  'curve',
  ['inputGeometry', 'coordinates', 'number', 'options', 'modes:closed'],
  curveOp
);
