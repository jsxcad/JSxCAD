export const taggedPolygonsWithHoles = (
  { tags = [], matrix, provenance, plane, exactPlane },
  polygonsWithHoles
) => {
  return {
    type: 'polygonsWithHoles',
    tags,
    matrix,
    provenance,
    plane,
    exactPlane,
    polygonsWithHoles,
  };
};
