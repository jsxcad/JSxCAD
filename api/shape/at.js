import Shape from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';
import { transform } from './transform.js';

export const at = Shape.registerMethod2(
  'at',
  ['input', 'inputGeometry', 'geometry', 'functions'],
  async (input, geometry, selection, ops) => {
    const { local, global } = getInverseMatrices(geometry);
    const { local: selectionLocal, global: selectionGlobal } =
      getInverseMatrices(selection);
    return transform(local)
      .transform(selectionGlobal)
      .op(...ops)
      .transform(selectionLocal)
      .transform(global)(input);
  }
);
