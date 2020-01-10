export const toTriangles = (options = {}, paths) => {
  const triangles = [];
  for (const path of paths) {
    for (let nth = 2; nth < path.length; nth++) {
      triangles.push([path[0], path[nth - 1], path[nth]]);
    }
  }
  return triangles;
};
