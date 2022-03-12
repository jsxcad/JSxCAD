import { logInfo } from './log.js';

export const aggregates = new Map();

export const startTime = (name) => {
  if (!aggregates.has(name)) {
    aggregates.set(name, { name, count: 0, total: 0, average: 0 });
  }
  const start = new Date();
  const aggregate = aggregates.get(name);
  const timer = { start, name, aggregate };
/*
  logInfo('sys/profile/startTime', name);
*/
  return timer;
};

export const endTime = ({ start, name, aggregate }) => {
  const end = new Date();
  const seconds = (end - start) / 1000;
  aggregate.last = seconds;
  aggregate.total += seconds;
  aggregate.count += 1;
  aggregate.average = aggregate.total / aggregate.count;
/*
  const { average, count, last, total } = aggregate;
  logInfo(
    'sys/profile/endTime',
    `${name} average: ${average.toFixed(
      2
    )} count: ${count} last: ${last.toFixed(2)} total: ${total.toFixed(2)}`
  );
*/
  return aggregate;
};

export const reportTimes = () => {
  const entries = [...aggregates.values()].sort((a, b) => a.total - b.total);
  for (const { average, count, last, name, total } of entries) {
    logInfo(
      'sys/profile',
      `${name} average: ${average.toFixed(
        2
      )} count: ${count} last: ${last.toFixed(2)} total: ${total.toFixed(2)}`
    );
  }
};
