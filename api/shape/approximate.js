import Shape from './Shape.js';
import { approximate as approximateGeometry } from '@jsxcad/geometry';
import { destructure2 } from './destructure.js';

export const approximate = Shape.registerMethod(
  'approximate',
  (...args) =>
    async (shape) => {
      const [options] = await destructure2(shape, args, 'options');
      const {
        iterations,
        relaxationSteps,
        minimumErrorDrop,
        subdivisionRatio,
        relativeToChord,
        withDihedralAngle,
        optimizeAnchorLocation,
        pcaPlane,
        maxNumberOfProxies,
      } = options;
      return Shape.fromGeometry(
        approximateGeometry(
          shape.toGeometry(),
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
      );
    }
);
