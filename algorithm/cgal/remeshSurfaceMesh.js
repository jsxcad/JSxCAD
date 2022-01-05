import { getCgal } from './getCgal.js';

export const remeshSurfaceMesh = (mesh, ...lengths) => {
  try {
    const remeshedMesh = getCgal().RemeshSurfaceMesh(mesh, () => {
      if (lengths.length > 0) {
        return lengths.shift();
      } else {
        return -1;
      }
    });
    remeshedMesh.provenance = 'remesh';
    return remeshedMesh;
  } catch (error) {
    throw Error(error);
  }
};
