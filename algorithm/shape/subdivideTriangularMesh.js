const subdivideTriangle = require('./subdivideTriangle');

const subdivideTriangularMesh = (mesh) => {
  const subdividedMesh = [];
  for (const triangle of mesh) {
    for (const subTriangle of subdivideTriangle(triangle)) {
      subdividedMesh.push(subTriangle);
    }
  }
  return subdividedMesh;
};

module.exports = subdivideTriangularMesh;
