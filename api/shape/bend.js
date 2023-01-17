import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend = Shape.registerMethod(
  'bend',
  (radius = 100) =>
    async (shape) =>
      Shape.fromGeometry(bendGeometry(await shape.toGeometry(), radius))
);
