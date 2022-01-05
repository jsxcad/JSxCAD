import { getCgal } from './getCgal.js';

export const describeSurfaceMesh = (mesh) => {
  try {
    let description;
    getCgal().DescribeSurfaceMesh(mesh, (vertices, faces) => {
      description = { vertices, faces };
    });
    return description;
  } catch (error) {
    throw Error(error);
  }
};
