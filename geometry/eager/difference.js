import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { difference as solidDifference } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface';

export const difference = (...geometries) => {
  const assembly = { assembly: geometries };
  const pathsData = filterAndFlattenAssemblyData({ form: 'paths' }, assembly);
  const solidData = filterAndFlattenAssemblyData({ form: 'solid' }, assembly);
  const z0SurfaceData = filterAndFlattenAssemblyData({ form: 'z0Surface' }, assembly);
  const differenced = { assembly: [] };
  if (pathsData.length > 0) {
    differenced.assembly.push({ paths: pathsDifference(...pathsData) });
  }
  if (solidData.length > 0) {
    differenced.assembly.push({ solid: solidDifference(...solidData) });
  }
  if (z0SurfaceData.length > 0) {
    differenced.assembly.push({ z0Surface: z0SurfaceDifference(...z0SurfaceData) });
  }
  return differenced;
};
