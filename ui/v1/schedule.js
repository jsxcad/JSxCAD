export const animationFrame = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1);
  });
};
