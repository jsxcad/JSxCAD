import { getConfig, logInfo } from '@jsxcad/sys';
import { starts, totals } from './startTimer.js';

import Shape from './Shape.js';

export const endTimer = (name) => (shape) => {
  const start = starts.get(name);
  const ms = start !== undefined ? new Date() - start : -1;
  const total = totals.get(name) || { sum: 0, count: 0, history: [] };
  total.sum += ms;
  total.count += 1;
  // total.history.push(ms);
  totals.set(name, total);
  if (total.sum >= 1000) {
    const message = `${name}: ${(total.sum / 1000).toFixed(2)} [${(
      total.sum /
      (1000 * total.count)
    ).toFixed(2)}]`;
    logInfo('api/shape/endTimer', message);
    if (getConfig().api?.shape?.endTimer?.md) {
      shape = shape.md(message);
    }
  }
  return shape;
};

Shape.registerMethod('endTimer', endTimer);
