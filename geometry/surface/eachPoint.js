export const eachPoint = (thunk, surface) => {
  for (const polygon of surface) {
    for (const [x = 0, y = 0, z = 0] of polygon) {
      thunk([x, y, z]);
    }
  }
};
