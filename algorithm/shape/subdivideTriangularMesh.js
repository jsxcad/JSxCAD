import { subdivideTriangle } from './subdivideTriangle.js';

export const subdivideTriangularMesh = (mesh) => {
  const subdividedMesh = [];
  for (const triangle of mesh) {
    for (const subTriangle of subdivideTriangle(triangle)) {
      subdividedMesh.push(subTriangle);
    }
  }
  return subdividedMesh;
};
