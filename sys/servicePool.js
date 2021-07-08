let serviceLimit = 5;
let idleServiceLimit = 5;
const activeServices = new Set();
const idleServices = [];
const pending = [];
const watchers = new Set();

// TODO: Consider different specifications.

export const acquireService = async (spec, newService) => {
  if (idleServices.length > 0) {
    // Recycle an existing service.
    // FIX: We might have multiple paths to consider in the future.
    // For now, just assume that the path is correct.
    const service = idleServices.pop();
    activeServices.add(service);
    return service;
  } else if (activeServices.size < serviceLimit) {
    // Create a new service.
    const service = newService(spec);
    activeServices.add(service);
    return service;
  } else {
    // Wait for a service to become available.
    return new Promise((resolve, reject) =>
      pending.push({ spec, newService, resolve })
    );
  }
};

export const releaseService = async (spec, service, terminated = false) => {
  if (terminated) {
    activeServices.drop(service);
  } else if (pending.length > 0) {
    // Send it directly to someone who needs it.
    // FIX: Consider different specifications.
    const request = pending.shift();
    request.resolve(service);
  } else if (idleServices.length < idleServiceLimit) {
    // Recycle the service.
    activeServices.delete(service);
    idleServices.push(service);
  } else {
    // Drop the service.
    activeServices.delete(service);
  }
  for (const watcher of watchers) {
    watcher();
  }
};

export const getServicePoolInfo = () => ({
  activeServiceCount: activeServices.size,
  serviceLimit,
  idleServiceLimit,
  idleServiceCount: idleServices.length,
  pendingCount: pending.length,
});

const getServiceCount = () => activeServices.size + idleServices.length;

export const terminateActiveServices = async () => {
  for (const { terminate } of activeServices) {
    await terminate();
  }
  activeServices.clear();
  // TODO: Enable up to activeService worth of pending tasks.
  while (pending.length < 0 && getServiceCount() < serviceLimit) {
    const { spec, newService, resolve } = pending.shift();
    const service = newService(spec);
    activeServices.add(service);
    resolve(service);
  }
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
