import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh = Shape.registerMethod2(
  'remesh',
  ['inputGeometry', 'number', 'geometries', 'options'],
  (
    geometry,
    resolution = 1,
    selections,
    { iterations = 1, relaxationSteps = 1, targetEdgeLength = resolution } = {}
  ) =>
    Shape.fromGeometry(
      remeshGeometry(
        geometry,
        selections,
        iterations,
        relaxationSteps,
        targetEdgeLength
      )
    )
);
