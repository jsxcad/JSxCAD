import Shape from './Shape.js';

export const starts = new Map();

export const startTimer = (name) => (shape) => {
  starts.set(name, new Date());
  return shape;
};

Shape.registerMethod('startTimer', startTimer);
