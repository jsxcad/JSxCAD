import { toPlane } from '@jsxcad/math-poly3';

const intern = (map, point, next, update) => {
  const key = JSON.stringify(point);
  let index = map[key];
  if (index !== undefined) {
    return index;
  }
  map[key] = next;
  update(point);
  return next;
};

export const trianglesToThreejsDatasets = (options = {}, ...triangularGeometries) => {
  // Translate the paths to threejs geometry data.
  const datasets = [];
  for (const triangles of triangularGeometries) {
    const indices = [];
    const vertexMap = {};
    const positions = [];
    const normals = [];

    for (const triangle of triangles) {
      const [x, y, z] = toPlane(triangle);
      const normal = [x, y, z];
      for (const point of triangle) {
        indices.push(intern(vertexMap,
                            [point, normal],
                            Math.floor(positions.length / 3),
                            ([point, normal]) => {
                              positions.push(...point);
                              normals.push(...normal);
                            }));
      }
    }
    datasets.push({ name: triangles.name, material: triangles.material, indices, positions, normals });
  }
  return datasets;
};
