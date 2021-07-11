import { createService } from './service.js';

let activeServiceLimit = 5;
let idleServiceLimit = 5;
const activeServices = new Set();
const idleServices = [];
const pending = [];
const watchers = new Set();

// TODO: Consider different specifications.

export const acquireService = async (spec) => {
  if (idleServices.length > 0) {
    // Recycle an existing worker.
    // FIX: We might have multiple paths to consider in the future.
    // For now, just assume that the path is correct.
    const service = idleServices.pop();
    activeServices.add(service);
    if (service.released) {
      throw Error('die');
    }
    return service;
  } else if (activeServices.size < activeServiceLimit) {
    // Create a new service.
    const service = createService({ ...spec, release: releaseService });
    activeServices.add(service);
    if (service.released) {
      throw Error('die');
    }
    return service;
  } else {
    // Wait for a service to become available.
    return new Promise((resolve, reject) => pending.push({ spec, resolve }));
  }
};

export const releaseService = (spec, service, terminate = false) => {
  service.poolReleased = true;
  activeServices.delete(service);
  const worker = service.releaseWorker();
  if (worker) {
    if (terminate || idleServices.length >= idleServiceLimit) {
      worker.terminate();
    } else {
      idleServices.push(
        createService({ ...spec, release: releaseService }, worker)
      );
    }
  }
  if (pending.length > 0 && activeServices.size < activeServiceLimit) {
    const request = pending.shift();
    request.resolve(acquireService(request.spec));
  }
  for (const watcher of watchers) {
    watcher();
  }
};

export const getServicePoolInfo = () => ({
  activeServiceCount: activeServices.size,
  activeServiceLimit,
  idleServiceLimit,
  idleServiceCount: idleServices.length,
  pendingCount: pending.length,
});

export const terminateActiveServices = () => {
  for (const { terminate } of activeServices) {
    terminate();
  }
};

export const askService = (spec, question, transfer) => {
  let terminated;
  let terminate = () => {
    terminated = true;
  };
  const flow = async () => {
    const service = await acquireService(spec);
    if (service.released) {
      return Promise.reject(Error('Terminated'));
    }
    terminate = () => {
      service.terminate();
      throw Error('Terminated');
    };
    if (terminated) {
      terminate();
    }
    const answer = service.ask(question, transfer);
    console.log(`QQ/askService/release`);
    await service.waitToFinish();
    service.finished = true;
    service.release();
    return answer;
  };
  const promise = flow();
  // Avoid a race in which the service might be terminated before
  // acquireService returns.
  promise.terminate = () => terminate();
  return promise;
};

export const askServices = async (question) => {
  for (const { ask } of [...idleServices, ...activeServices]) {
    await ask(question);
  }
};

export const tellServices = (question) => {
  for (const { tell } of [...idleServices, ...activeServices]) {
    tell(question);
  }
};

export const waitServices = () => {
  return new Promise((resolve, reject) => {
    let watcher;
    watcher = () => {
      unwatchServices(watcher);
      resolve();
    };
    watchServices(watcher);
  });
};

export const watchServices = (watcher) => {
  watchers.add(watcher);
  return watcher;
};

export const unwatchServices = (watcher) => {
  watchers.delete(watcher);
  return watcher;
};
