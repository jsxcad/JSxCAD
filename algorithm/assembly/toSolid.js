import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointGeometry } from './toDisjointGeometry';
import { union } from '@jsxcad/algorithm-bsp-surfaces';

export const toSolid = ({ requires, excludes }, assembly) => {
  const disjoint = toDisjointGeometry(assembly);
  const filtered = filterAndFlattenAssemblyData({ requires, excludes, form: 'solid' }, disjoint);
  const unioned = union(...filtered);
  return unioned;
};
