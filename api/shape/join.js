import { fuse, join as joinGeometry } from '@jsxcad/geometry';
import Group from './Group.js';
import Shape from './Shape.js';

export const Join = Shape.registerMethod2(
  ['Add', 'Fuse', 'Join'],
  ['input', 'shapes', 'modes:exact'],
  async (input, shapes, modes) => {
    const group = await Group(...shapes);
    return Shape.fromGeometry(
      fuse(await group.toGeometry(), modes.includes('exact'))
    );
  }
);

export const join = Shape.registerMethod2(
  ['add', 'fuse', 'join'],
  ['inputGeometry', 'geometries', 'modes:exact,noVoid'],
  (geometry, geometries, modes) =>
    Shape.fromGeometry(
      joinGeometry(
        geometry,
        geometries,
        modes.includes('exact'),
        modes.includes('noVoid')
      )
    )
);
