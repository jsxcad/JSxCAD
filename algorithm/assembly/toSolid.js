import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointAssembly } from './toDisjointAssembly';
import { union } from '@jsxcad/algorithm-bsp-surfaces';

export const toSolid = ({ requires, excludes }, assembly) =>
  union(...filterAndFlattenAssemblyData({ requires, excludes, form: 'solid' }, toDisjointAssembly(assembly)));
