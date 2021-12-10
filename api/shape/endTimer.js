import Shape from './Shape.js';
import { starts } from './startTimer.js';

export const totals = new Map();

export const endTimer = (name) => (shape) => {
  const start = starts.get(name);
  const ms = start !== undefined ? new Date() - start : -1;
  const total = totals.get(name) || { sum: 0, count: 0, history: [] };
  total.sum += ms;
  total.count += 1;
  total.history.push(ms);
  totals.set(name, total);
  return shape.md(
    `${name}: ${total.history
      .map((ms) => (ms / 1000).toFixed(2))
      .join(', ')} [${(total.sum / (1000 * total.count)).toFixed(2)}]`
  );
};

Shape.registerMethod('endTimer', endTimer);
