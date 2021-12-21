import { getConfig, logInfo } from '@jsxcad/sys';
import { starts, totals } from './startTimer.js';

import Shape from './Shape.js';

export const endTimer = (name) => (shape) => {
  const start = starts.get(name);
  const ms = start !== undefined ? new Date() - start : -1;
  const total = totals.get(name) || { sum: 0, count: 0 };
  total.sum += ms;
  total.count += 1;
  totals.set(name, total);
  const sum = total.sum / 1000;
  if (sum >= 1.0) {
    const average = total.sum / total.count / 1000;
    const message = `${name}: ${sum.toFixed(2)} [${average.toFixed(2)}]`;
    logInfo('api/shape/endTimer', message);
    if (getConfig().api?.shape?.endTimer?.md) {
      shape = shape.md(message);
    }
  }
  return shape;
};

Shape.registerMethod('endTimer', endTimer);
