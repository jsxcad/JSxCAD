import Shape from './Shape.js';
import { split as splitGeometry } from '@jsxcad/geometry';

export const split =
  ({
    keepVolumes = true,
    keepCavitiesInVolumes = true,
    keepCavitiesAsVolumes = false,
  } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      splitGeometry(
        shape.toGeometry(),
        keepVolumes,
        keepCavitiesInVolumes,
        keepCavitiesAsVolumes
      )
    );

Shape.registerMethod('split', split);
