import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointGeometry } from './toDisjointGeometry';
import { union } from '@jsxcad/algorithm-z0surface';

export const toZ0Surface = ({ requires, excludes }, assembly) =>
  union(...filterAndFlattenAssemblyData({ requires, excludes, form: 'z0Surface' }, toDisjointGeometry(assembly)));
