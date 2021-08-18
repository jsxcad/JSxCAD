export const toGeometry = (to, from) => {
  if (to instanceof Function) {
    return to(from).toGeometry();
  } else {
    return to.toGeometry();
  }
};
