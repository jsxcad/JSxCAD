import { Disjoint } from '@jsxcad/geometry';
import { fromGeometry } from './Shape.js';

export const assemble = async ({ exact }, ...shapes) => {
  const geometries = [];
  for (const shape of shapes) {
    if (shape === undefined) {
      continue;
    }
    geometries.push(await shape.toGeometry());
  }
  return fromGeometry(Disjoint(geometries, { exact }));
};

export default assemble;
