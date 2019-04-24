import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointAssembly } from './toDisjointAssembly';
import { union } from '@jsxcad/algorithm-z0surface';

export const toZ0Surface = ({ requires, excludes }, assembly) =>
  union(...filterAndFlattenAssemblyData({ requires, excludes, form: 'z0Surface' }, toDisjointAssembly(assembly)));
