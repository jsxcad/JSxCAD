export const eachPoint = (options = {}, thunk, points) => {
  for (const point of points) {
    thunk(point);
  }
};
