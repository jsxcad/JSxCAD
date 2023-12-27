import Shape from './Shape.js';
import { fair as fairGeometry } from '@jsxcad/geometry';

export const fair = Shape.registerMethod3(
  'fair',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (
    geometry,
    selections,
    implicitResolution,
    {
      numberOfIterations,
      remeshIterations,
      remeshRelaxationSteps,
      resolution = implicitResolution,
    } = {}
  ) =>
    fairGeometry(geometry, selections, {
      numberOfIterations,
      remeshIterations,
      remeshRelaxationSteps,
      resolution,
    })
);
