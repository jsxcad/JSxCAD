import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { loft as loftGeometry } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Loft = Shape.registerMethod('Loft', (...args) => async (shape) => {
  const [modes, shapes] = await destructure2(shape, args, 'modes', 'shapes');
  return Shape.fromGeometry(
    loftGeometry(
      await toShapesGeometries(shapes)(shape),
      !modes.includes('open')
    )
  );
});

export const loft = Shape.registerMethod(
  'loft',
  (...args) =>
    async (shape) =>
      Loft(shape, ...args)(shape)
);

export default Loft;
