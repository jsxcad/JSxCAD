import Shape from './Shape.js';
import { toPoints as toPointsGeometry } from '@jsxcad/geometry';

export const toCoordinates = Shape.registerMethod2(
  'toCoordinates',
  ['inputGeometry'],
  (inputGeometry) => toPointsGeometry(inputGeometry).points
);

export default toCoordinates;
