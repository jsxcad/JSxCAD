import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointGeometry } from './toDisjointGeometry';
import { union } from '@jsxcad/algorithm-bsp-surfaces';

export const toSolid = ({ requires, excludes }, assembly) =>
  ({
     solid: union(filterAndFlattenAssemblyData({ requires, excludes, form: 'solid' }, toDisjointGeometry(assembly)))
   });
