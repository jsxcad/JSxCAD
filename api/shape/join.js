import { fuse, join as joinGeometry } from '@jsxcad/geometry';
import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { toShapeGeometry } from './toShapeGeometry.js';

export const Join = Shape.registerMethod('Join', (...args) => async (shape) => {
  const [modes, shapes] = await destructure2(shape, args, 'modes', 'shapes');
  const group = await Group(...shapes);
  return Shape.fromGeometry(
    fuse(await toShapeGeometry(group)(shape), modes.includes('exact'))
  );
});

export const join = Shape.registerMethod(
  ['add', 'join'],
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      return Shape.fromGeometry(
        joinGeometry(
          await shape.toGeometry(),
          await shape.toShapesGeometries(shapes),
          modes.includes('exact'),
          modes.includes('noVoid')
        )
      );
    }
);
