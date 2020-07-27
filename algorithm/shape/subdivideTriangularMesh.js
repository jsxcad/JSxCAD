import { subdivideTriangle } from './subdivideTriangle.js';

/** @type {function(mesh:Triangle[]):Triangle[]} */
export const subdivideTriangularMesh = (mesh) => {
  /** @type {Triangle[]} */
  const subdividedMesh = [];
  for (const triangle of mesh) {
    for (const subTriangle of subdivideTriangle(triangle)) {
      subdividedMesh.push(subTriangle);
    }
  }
  return subdividedMesh;
};
