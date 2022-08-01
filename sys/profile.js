import { logInfo } from './log.js';

export const aggregates = new Map();

export const clearTimes = () => {
  aggregates.clear();
};
export const getTimes = () => [...aggregates];

export const startTime = (name) => {
  if (!aggregates.has(name)) {
    aggregates.set(name, { name, count: 0, total: 0, average: 0 });
  }
  const start = new Date();
  const aggregate = aggregates.get(name);
  const timer = { start, name, aggregate };
  return timer;
};

export const endTime = ({ start, name, aggregate }) => {
  const end = new Date();
  const seconds = (end - start) / 1000;
  aggregate.last = seconds;
  aggregate.total += seconds;
  aggregate.count += 1;
  aggregate.average = aggregate.total / aggregate.count;
  return aggregate;
};

export const reportTimes = () => {
  const entries = [...aggregates.values()].sort((a, b) => a.total - b.total);
  for (const { average, count, last, name, total } of entries) {
    logInfo(
      'profile',
      `${name} average: ${average.toFixed(
        2
      )} count: ${count} last: ${last.toFixed(2)} total: ${total.toFixed(2)}`
    );
  }
};
