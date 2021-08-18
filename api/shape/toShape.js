export const toShape = (to, from) => {
  if (to instanceof Function) {
    return to(from);
  } else {
    return to;
  }
};
