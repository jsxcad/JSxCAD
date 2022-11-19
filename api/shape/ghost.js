import Shape from './Shape.js';
import { hasTypeGhost } from '@jsxcad/geometry';

export const ghost = Shape.registerMethod(
  'ghost',
  () => async (shape) => {
    const result = Shape.fromGeometry(hasTypeGhost(await shape.toGeometry()));
    return result;
  }
);
