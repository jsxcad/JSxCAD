import { filterAndFlattenAssemblyData } from './filterAndFlattenAssemblyData';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { intersection as solidIntersection } from '@jsxcad/algorithm-bsp-surfaces';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface';

export const intersection = (...geometries) => {
  const assembly = { assembly: geometries };
  const pathsData = filterAndFlattenAssemblyData({ form: 'paths' }, assembly);
  const solidData = filterAndFlattenAssemblyData({ form: 'solid' }, assembly);
  const z0SurfaceData = filterAndFlattenAssemblyData({ form: 'z0Surface' }, assembly);
  const intersectioned = { assembly: [] };
  if (pathsData.length > 0) {
    intersectioned.assembly.push({ paths: pathsIntersection(...pathsData) });
  }
  if (solidData.length > 0) {
    intersectioned.assembly.push({ solid: solidIntersection(...solidData) });
  }
  if (z0SurfaceData.length > 0) {
    intersectioned.assembly.push({ z0Surface: z0SurfaceIntersection(...z0SurfaceData) });
  }
  return intersectioned;
};
