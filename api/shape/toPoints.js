import Shape from './Shape.js';
import { toPoints as toPointsGeometry } from '@jsxcad/geometry';

export const toPoints = Shape.registerMethod('toPoints', () => async (shape) => {
  const points = toPointsGeometry(await shape.toGeometry()).points;
  console.log(`QQQ/points: ${JSON.stringify(points)}`);
  return points;
});

export default toPoints;
