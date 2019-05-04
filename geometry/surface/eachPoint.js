export const eachPoint = (options = {}, thunk, surface) => {
  for (const polygon of surface) {
    for (const point of polygon) {
      thunk(point);
    }
  }
};
