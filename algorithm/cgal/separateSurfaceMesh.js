import { getCgal } from './getCgal.js';

export const separateSurfaceMesh = (
  mesh,
  keepVolumes = true,
  keepCavitiesInVolumes = true,
  keepCavitiesAsVolumes = false
) => {
  try {
    const meshes = [];
    getCgal().SeparateSurfaceMesh(
      mesh,
      keepVolumes,
      keepCavitiesInVolumes,
      keepCavitiesAsVolumes,
      (mesh) => meshes.push(mesh)
    );
    return meshes;
  } catch (error) {
    throw Error(error);
  }
};
