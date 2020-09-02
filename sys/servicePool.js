let serviceLimit = 5;
let idleServiceLimit = 5;
const activeServices = new Set();
const idleServices = [];
const pending = [];

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
    const service = await newService(spec);
    activeServices.add(service);
    return service;
  } else {
    // Wait for a service to become available.
    return new Promise((resolve, reject) =>
      pending.push({ spec, newService, resolve })
    );
  }
};

export const releaseService = async (spec, service) => {
  if (pending.length > 0) {
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
};

export const getServicePoolInfo = async () => ({
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
    const service = await newService(spec);
    activeServices.add(service);
    resolve(service);
  }
};
