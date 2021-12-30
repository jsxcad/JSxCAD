import { createService } from './service.js';
import { logInfo } from './log.js';

let activeServiceLimit = 5;
let idleServiceLimit = 5;
const activeServices = new Set();
const idleServices = [];
const pending = [];
const watchers = new Set();

// TODO: Consider different specifications.

const notifyWatchers = () => {
  for (const watcher of watchers) {
    watcher();
  }
};

export const acquireService = async (spec, context) => {
  if (idleServices.length > 0) {
    logInfo('sys/servicePool', 'Recycle worker');
    logInfo(
      'sys/servicePool/counts',
      `Active service count: ${activeServices.size}`
    );
    // Recycle an existing worker.
    // FIX: We might have multiple paths to consider in the future.
    // For now, just assume that the path is correct.
    const service = idleServices.pop();
    activeServices.add(service);
    if (service.released) {
      throw Error('die');
    }
    service.context = context;
    notifyWatchers();
    return service;
  } else if (activeServices.size < activeServiceLimit) {
    logInfo('sys/servicePool', 'Allocate worker');
    logInfo(
      'sys/servicePool/counts',
      `Active service count: ${activeServices.size}`
    );
    // Create a new service.
    const service = createService({ ...spec, release: releaseService });
    activeServices.add(service);
    if (service.released) {
      throw Error('die');
    }
    service.context = context;
    notifyWatchers();
    return service;
  } else {
    logInfo('sys/servicePool', 'Wait for worker');
    logInfo(
      'sys/servicePool/counts',
      `Active service count: ${activeServices.size}`
    );
    // Wait for a service to become available.
    return new Promise((resolve, reject) =>
      pending.push({ spec, resolve, context })
    );
  }
};

export const releaseService = (spec, service, terminate = false) => {
  logInfo('sys/servicePool', 'Release worker');
  logInfo(
    'sys/servicePool/counts',
    `Active service count: ${activeServices.size}`
  );
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
    const { spec, resolve, context } = pending.shift();
    resolve(acquireService(spec, context));
  }
  notifyWatchers();
};

export const getServicePoolInfo = () => ({
  activeServices: [...activeServices],
  activeServiceCount: activeServices.size,
  activeServiceLimit,
  idleServices: [...idleServices],
  idleServiceLimit,
  idleServiceCount: idleServices.length,
  pendingCount: pending.length,
});

export const getActiveServices = (contextFilter = (context) => true) => {
  const filteredServices = [];
  for (const service of activeServices) {
    const { context } = service;
    if (contextFilter(context)) {
      filteredServices.push(service);
    }
  }
  return filteredServices;
};

export const terminateActiveServices = (contextFilter = (context) => true) => {
  for (const { terminate, context } of activeServices) {
    if (contextFilter(context)) {
      terminate();
    }
  }
};

export const askService = (spec, question, transfer, context) => {
  let terminated;
  let doTerminate = () => {
    terminated = true;
  };
  const terminate = () => doTerminate();
  const flow = async () => {
    let service;
    try {
      service = await acquireService(spec, context);
      if (service.released) {
        return Promise.reject(Error('Terminated'));
      }
      doTerminate = () => {
        service.terminate();
        return Promise.reject(Error('Terminated'));
      };
      if (terminated) {
        return terminate();
      }
      const answer = await service.ask(question, transfer);
      return answer;
    } catch (error) {
      throw error;
    } finally {
      if (service) {
        await service.waitToFinish();
        service.finished = true;
        service.release();
      }
    }
  };
  const answer = flow();
  // Avoid a race in which the service might be terminated before
  // acquireService returns.
  return { answer, terminate };
};

export const askServices = async (question) => {
  for (const { ask } of [...idleServices, ...activeServices]) {
    await ask(question);
  }
};

export const tellServices = (statement) => {
  for (const { tell } of [...idleServices, ...activeServices]) {
    tell(statement);
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
