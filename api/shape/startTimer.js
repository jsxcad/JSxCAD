import Shape from './Shape.js';
import { logInfo } from '@jsxcad/sys';

export const starts = new Map();
export const totals = new Map();

export const startTimer = (name) => (shape) => {
  const start = new Date();
  starts.set(name, start);
  const total = totals.get(name);
  if (total) {
    const average = total.sum / total.count / 1000;
    if (average > 1.0) {
      logInfo('api/shape/startTimer', `${name} [${average.toFixed(2)}]`);
    }
  }
  return shape;
};

Shape.registerMethod('startTimer', startTimer);
