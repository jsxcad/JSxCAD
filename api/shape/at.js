import Shape from './Shape.js';
import { getInverseMatrices } from '@jsxcad/geometry';
import { transform } from './transform.js';

export const at = Shape.registerMethod2(
  'at',
  ['input', 'functions', 'shapes'],
  async (input, ops, selections) => {
    const { local, global } = getInverseMatrices(await input.toGeometry());
    for (const selection of selections) {
      const { local: selectionLocal, global: selectionGlobal } =
        getInverseMatrices(await selection.toGeometry());
      input = transform(local)
        .transform(selectionGlobal)
        .op(...ops)
        .transform(selectionLocal)
        .transform(global)(input);
    }
    return input;
  }
);
