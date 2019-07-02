// For profiling.

let time = new Date().getTime();

export const startClock = (value) => {
  time = new Date().getTime();
};

export const getClock = () => {
  return new Date().getTime() - time;
};
