import { getCgal } from './getCgal.js';

export const splitSurfaceMesh = (
  mesh,
  keepVolumes = true,
  keepCavitiesInVolumes = true,
  keepCavitiesAsVolumes = false
) => {
  const meshes = [];
  getCgal().SplitSurfaceMesh(
    mesh,
    keepVolumes,
    keepCavitiesInVolumes,
    keepCavitiesAsVolumes,
    (mesh) => meshes.push(mesh)
  );
  return meshes;
};
