import Shape from './Shape.js';
import { separate as separateGeometry } from '@jsxcad/geometry';

export const separate =
  ({
    keepVolumes = true,
    keepCavitiesInVolumes = true,
    keepCavitiesAsVolumes = false,
  } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      separateGeometry(
        shape.toGeometry(),
        keepVolumes,
        keepCavitiesInVolumes,
        keepCavitiesAsVolumes
      )
    );

Shape.registerMethod('separate', separate);
