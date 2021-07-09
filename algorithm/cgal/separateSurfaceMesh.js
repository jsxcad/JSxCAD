import { getCgal } from './getCgal.js';

export const separateSurfaceMesh = (
  mesh,
  keepVolumes = true,
  keepCavitiesInVolumes = true,
  keepCavitiesAsVolumes = false
) => {
  const meshes = [];
  getCgal().SeparateSurfaceMesh(
    mesh,
    keepVolumes,
    keepCavitiesInVolumes,
    keepCavitiesAsVolumes,
    (mesh) => meshes.push(mesh)
  );
  return meshes;
};
