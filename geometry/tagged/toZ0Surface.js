import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { toDisjointGeometry } from './toDisjointGeometry';
import { union } from '@jsxcad/geometry-z0surface';

export const toZ0Surface = ({ requires, excludes }, assembly) => {
  const filtered = filterAndFlattenAssemblyData({ requires, excludes, form: 'z0Surface' }, toDisjointGeometry(assembly));
  const unioned = union(...filtered);
  return { z0Surface: unioned };
};
