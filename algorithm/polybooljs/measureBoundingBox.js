// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
export const measureBoundingBox = (surface) => {
  if (surface.measureBoundingBox === undefined) {
    const max = [-Infinity, -Infinity];
    const min = [Infinity, Infinity];
    for (const polygon of surface) {
      for (const point of polygon) {
        if (point[0] < min[0]) min[0] = point[0];
        if (point[1] < min[1]) min[1] = point[1];
        if (point[0] > max[0]) max[0] = point[0];
        if (point[1] > max[1]) max[1] = point[1];
      }
    }
    surface.measureBoundingBox = [min, max];
  }
  return surface.measureBoundingBox;
};
