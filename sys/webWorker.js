/* global Worker */

export const webWorker = (spec) =>
  new Worker(spec.webWorker, { type: spec.workerType });
