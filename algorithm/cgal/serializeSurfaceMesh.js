import { getCgal } from './getCgal.js';

export const serializeSurfaceMesh = (mesh) =>
  getCgal().SerializeSurfaceMesh(mesh, (vertex, numberOfVertices) => {
    throw Error(`Vertex ${vertex} out of range ${numberOfVertices}`);
  });
