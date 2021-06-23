import { getCgal } from './getCgal.js';

export const remeshSurfaceMesh = (mesh, ...lengths) =>
  getCgal().RemeshSurfaceMesh(mesh, () => {
    if (lengths.length > 0) {
      return lengths.shift();
    } else {
      return -1;
    }
  });
