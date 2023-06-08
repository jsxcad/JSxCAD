import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth = Shape.registerMethod2(
  'smooth',
  ['inputGeometry', 'number', 'options', 'geometries'],
  (
    geometry,
    resolution = 1,
    {
      iterations = 1,
      time = 1,
      remeshIterations = 1,
      remeshRelaxationSteps = 1,
    } = {},
    selections
  ) =>
    Shape.fromGeometry(
      smoothGeometry(
        geometry,
        selections,
        resolution,
        iterations,
        time,
        remeshIterations,
        remeshRelaxationSteps
      )
    )
);
