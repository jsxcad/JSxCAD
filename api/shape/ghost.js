import Shape from './Shape.js';
import { hasTypeGhost } from '@jsxcad/geometry';

export const ghost = Shape.registerMethod(
  'ghost',
  () => async (shape) => {
    console.log(`QQ/ghost/before: ${JSON.stringify(shape)}`);
    const result = Shape.fromGeometry(hasTypeGhost(await shape.toGeometry()))
    console.log(`QQ/ghost/after: ${JSON.stringify(result)}`);
    return result;
  }
);
