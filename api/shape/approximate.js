import Shape from './Shape.js';
import { approximate as approximateGeometry } from '@jsxcad/geometry';

export const approximate = Shape.registerMethod2(
  'approximate',
  ['inputGeometry', 'options'],
  (
    geometry,
    {
      iterations,
      relaxationSteps,
      minimumErrorDrop,
      subdivisionRatio,
      relativeToChord,
      withDihedralAngle,
      optimizeAnchorLocation,
      pcaPlane,
      maxNumberOfProxies,
    } = {}
  ) =>
    Shape.fromGeometry(
      approximateGeometry(
        geometry,
        iterations,
        relaxationSteps,
        minimumErrorDrop,
        subdivisionRatio,
        relativeToChord,
        withDihedralAngle,
        optimizeAnchorLocation,
        pcaPlane,
        maxNumberOfProxies
      )
    )
);
