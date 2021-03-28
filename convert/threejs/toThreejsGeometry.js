// import { toPlane } from '@jsxcad/math-poly3';

// const pointsToThreejsPoints = (points) => points;

/*
const trianglesToThreejsTriangles = (triangles) => {
  const normals = [];
  const positions = [];
  for (const triangle of triangles) {
    const plane = toPlane(triangle);
    if (plane === undefined) {
      continue;
    }
    const [px, py, pz] = plane;
    for (const [x = 0, y = 0, z = 0] of triangle) {
      normals.push(px, py, pz);
      positions.push(x, y, z);
    }
  }
  return { normals, positions };
};
*/

export const toThreejsGeometry = (geometry, supertags) => {
  return geometry;
  /*
  const tags = [...(supertags || []), ...(geometry.tags || [])];
  // if (tags.includes('compose/non-positive')) {
  //   return;
  // }
  if (geometry.isThreejsGeometry) {
    return geometry;
  }
  switch (geometry.type) {
    case 'layout':
    case 'assembly':
    case 'disjointAssembly':
    case 'layers':
      return {
        type: 'assembly',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'sketch':
      return {
        type: 'sketch',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'item':
      return {
        type: 'item',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'paths':
      return {
        type: 'paths',
        threejsPaths: geometry.paths,
        tags,
        isThreejsGeometry: true,
      };
    case 'plan':
      return {
        type: 'plan',
        threejsPlan: geometry.plan,
        threejsMarks: geometry.marks,
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'points':
      return {
        type: 'points',
        threejsPoints: pointsToThreejsPoints(geometry.points),
        tags,
        isThreejsGeometry: true,
      };
    case 'triangles':
      return {
        type: 'triangles',
        threejsTriangles: trianglesToThreejsTriangles(geometry.triangles),
        tags,
        isThreejsGeometry: true,
      };
    default:
      throw Error(`Unexpected geometry: ${geometry.type}`);
  }
*/
};
