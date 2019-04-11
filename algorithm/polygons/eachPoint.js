export const eachPoint = (options = {}, thunk, polygons) => {
  for (const polygon of polygons) {
    for (const point of polygon) {
      thunk(point);
    }
  }
};
