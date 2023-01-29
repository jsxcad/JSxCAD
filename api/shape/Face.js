import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const Face = Shape.registerMethod('Face', (...args) => async (shape) => {
  const [coordinates] = await destructure2(shape, args, 'coordinates');
  return Shape.chain(Shape.fromPolygons([{ points: coordinates }]));
});

export default Face;
