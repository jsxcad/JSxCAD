import { getCgal } from './getCgal.js';

export const separateSurfaceMesh = (
  mesh,
  keepShapes = true,
  keepHolesInShapes = true,
  keepHolesAsShapes = false
) => {
  try {
    const meshes = [];
    getCgal().SeparateSurfaceMesh(
      mesh,
      keepShapes,
      keepHolesInShapes,
      keepHolesAsShapes,
      (mesh) => {
        mesh.provenance = 'separate';
        meshes.push(mesh);
      }
    );
    return meshes;
  } catch (error) {
    throw Error(error);
  }
};
