import Shape from './Shape.js';
import { split as splitGeometry } from '@jsxcad/geometry';

export const split = (
  shape,
  {
    keepVolumes = true,
    keepCavitiesInVolumes = true,
    keepCavitiesAsVolumes = false,
  } = {}
) =>
  Shape.fromGeometry(
    splitGeometry(
      shape.toGeometry(),
      keepVolumes,
      keepCavitiesInVolumes,
      keepCavitiesAsVolumes
    )
  );

Shape.registerMethod('split', split);
