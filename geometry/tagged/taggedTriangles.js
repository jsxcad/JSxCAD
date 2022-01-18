export const taggedTriangles = (
  { tags = [], matrix, provenance },
  triangles
) => {
  return { type: 'triangles', tags, matrix, provenance, triangles };
};
