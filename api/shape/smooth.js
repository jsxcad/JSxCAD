import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth = Shape.registerMethod3(
  'smooth',
  ['inputGeometry', 'geometries', 'number', 'number', 'options'],
  (
    geometry,
    selections,
    implicitTime,
    implicitResolution,
    {
      iterations,
      time = implicitTime,
      remeshIterations,
      remeshRelaxationSteps,
      resolution = implicitResolution,
    } = {}
  ) =>
    smoothGeometry(
      geometry,
      selections,
      resolution,
      iterations,
      time,
      remeshIterations,
      remeshRelaxationSteps
    )
);
