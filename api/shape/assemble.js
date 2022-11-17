import { fromGeometry, toGeometry } from './Shape.js';

import { disjoint } from '@jsxcad/geometry';

export const assemble = async (modes, ...shapes) => {
  const geometries = [];
  for (const shape of shapes) {
    if (shape === undefined) {
      continue;
    }
    geometries.push(await shape.toGeometry());
  }
  return fromGeometry(
    disjoint(geometries, undefined, modes.includes('exact'))
  );
};

export default assemble;
