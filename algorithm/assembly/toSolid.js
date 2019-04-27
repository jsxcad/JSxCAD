import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointGeometry } from './toDisjointGeometry';
import { union } from '@jsxcad/algorithm-bsp-surfaces';

export const toSolid = ({ requires, excludes }, assembly) => {
  const disjoint = toDisjointGeometry(assembly);
console.log(`QQ/toSolid/disjoint: ${JSON.stringify(disjoint)}`);
  const filtered = filterAndFlattenAssemblyData({ requires, excludes, form: 'solid' }, disjoint);
console.log(`QQ/toSolid/filtered: ${JSON.stringify(filtered)}`);
  const unioned = union(...filtered);
console.log(`QQ/toSolid/unioned: ${JSON.stringify(unioned)}`);
  return unioned;
}
