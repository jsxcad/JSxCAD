import { fromGeometry, toGeometry } from './Shape.js';

import { disjoint } from '@jsxcad/geometry';

export const assemble = (modes, ...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  return fromGeometry(
    disjoint(shapes.map(toGeometry), undefined, modes.includes('exact'))
  );
};

export default assemble;
