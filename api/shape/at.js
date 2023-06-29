import Shape from './Shape.js';
import { at as atOp } from '@jsxcad/geometry';
import { op } from './op.js';

export const at = Shape.registerMethod3(
  'at',
  ['inputGeometry', 'geometry', 'functions'],
  atOp,
  async ([localGeometry, toGlobal], [_geometry, _selector, ops]) => {
    const localShape = Shape.fromGeometry(localGeometry);
    const resultShape = await op(...ops)(localShape);
    return Shape.fromGeometry(toGlobal(await resultShape.toGeometry()));
  }
);
