import { onBoot } from './boot.js';

let WorkerPromise;
let Worker;

export const initNodeWorker = async () => {
  // Do we need to deduplicate the import?
  if (WorkerPromise === undefined) {
    WorkerPromise = import('worker_threads');
  }
  const worker = await WorkerPromise;
  if (Worker === undefined) {
    Worker = worker.Worker;
  }
};

onBoot(initNodeWorker);

export const nodeWorker = (spec) => {
  const worker = new Worker(spec.nodeWorker);
  worker.on('message', (data) => worker.onmessage({ data }));
  worker.on('error', (error) => worker.onerror(error));
  return worker;
};
