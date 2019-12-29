export const eachPoint = (thunk, points) => {
  for (const point of points) {
    thunk(point);
  }
};
