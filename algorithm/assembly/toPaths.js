import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointAssembly } from './toDisjointAssembly';
import { union } from '@jsxcad/algorithm-paths';

export const toPaths = ({ requires, excludes }, assembly) =>
  union(...filterAndFlattenAssemblyData({ requires, excludes, form: 'paths' }, toDisjointAssembly(assembly)));
