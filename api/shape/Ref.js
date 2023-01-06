import Point from './Point.js';
import Shape from './Shape.js';
import { hasTypeReference } from '@jsxcad/geometry';

export const ref = Shape.registerMethod(
  'ref',
  () => async (shape) =>
    Shape.fromGeometry(hasTypeReference(await shape.toGeometry()))
);

export const Ref = Shape.registerMethod('Ref', (...args) => async (shape) => {
  const point = await Point(...args)(shape);
  const result = ref()(point);
  return result;
});

export default Ref;
