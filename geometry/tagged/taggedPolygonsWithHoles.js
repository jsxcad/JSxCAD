export const taggedPolygonsWithHoles = (
  { tags = [], plane, exactPlane },
  polygonsWithHoles
) => {
  return {
    type: 'polygonsWithHoles',
    tags,
    plane,
    exactPlane,
    polygonsWithHoles,
  };
};
