import Shape from './Shape.js';
import { computeGeneralizedDiameter } from '@jsxcad/geometry';

export const diameter = Shape.registerMethod3(
  'diameter',
  ['inputGeometry', 'function'],
  computeGeneralizedDiameter,
  (diameter, [geometry, op = (diameter) => (_shape) => diameter]) =>
    op(diameter)(Shape.fromGeometry(geometry))
);
