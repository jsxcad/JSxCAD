export const taggedTriangles = ({ tags = [], matrix }, triangles) => {
  return { type: 'triangles', tags, matrix, triangles };
};
