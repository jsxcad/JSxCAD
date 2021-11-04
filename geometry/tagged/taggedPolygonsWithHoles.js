export const taggedPolygonsWithHoles = (
  { tags = [], matrix, plane, exactPlane },
  polygonsWithHoles
) => {
  return {
    type: 'polygonsWithHoles',
    tags,
    matrix,
    plane,
    exactPlane,
    polygonsWithHoles,
  };
};
