import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { union as pathsUnion } from '@jsxcad/algorithm-paths';
import { union as solidUnion } from '@jsxcad/algorithm-bsp-surfaces';
import { union as z0SurfaceUnion } from '@jsxcad/algorithm-z0surface';

export const union = (...geometries) => {
  const assembly = { assembly: geometries };
  const pathsData = filterAndFlattenAssemblyData({ form: 'paths' }, assembly);
  const solidData = filterAndFlattenAssemblyData({ form: 'solid' }, assembly);
  const z0SurfaceData = filterAndFlattenAssemblyData({ form: 'z0Surface' }, assembly);
  const unioned = { assembly: [] };
  if (pathsData.length > 0) {
    unioned.assembly.push({ paths: pathsUnion(...pathsData) });
  }
  if (solidData.length > 0) {
    unioned.assembly.push({ solid: solidUnion(...solidData) });
  }
  if (z0SurfaceData.length > 0) {
    unioned.assembly.push({ z0Surface: z0SurfaceUnion(...z0SurfaceData) });
  }
  return unioned;
};
