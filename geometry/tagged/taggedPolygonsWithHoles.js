export const taggedPolygonsWithHoles = (
  { tags = [], matrix, provenance },
  polygonsWithHoles
) => {
  return {
    type: 'polygonsWithHoles',
    tags,
    matrix,
    provenance,
    plane: [0, 0, 1, 0],
    polygonsWithHoles,
  };
};
