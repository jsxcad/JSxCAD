import Shape from './Shape.js';
import { logInfo } from '@jsxcad/sys';

export const starts = new Map();
export const totals = new Map();

let timeoutId;

export const startTimer = (name) => (shape) => {
  starts.set(name, new Date());
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    timeoutId = null;
    logInfo('api/shape/startTimer', name);
  }, 1000);
  return shape;
};

Shape.registerMethod('startTimer', startTimer);
