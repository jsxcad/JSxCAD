export const sleep = (ms = 0) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
