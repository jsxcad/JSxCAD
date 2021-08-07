/* global requestAnimationFrame */

export const animationFrame = () => {
  return new Promise((resolve, reject) => {
    requestAnimationFrame(resolve);
  });
};
