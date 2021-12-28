import { getCgal } from './getCgal.js';

export const describeSurfaceMesh = (mesh) => {
  let description;
  getCgal().DescribeSurfaceMesh(mesh, (vertices, faces) => { description = { vertices, faces }; });
  return description;
};
