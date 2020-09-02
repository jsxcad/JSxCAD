let serviceCount = 0;
let serviceLimit = 5;
let idleServiceLimit = 5;
const idleServices = [];
const pending = [];

// TODO: Consider different specifications.

export const acquireService = async (spec, newService) => {
  if (idleServices.length > 0) {
    // Recycle an existing service.
    // FIX: We might have multiple paths to consider in the future.
    // For now, just assume that the path is correct.
    return idleServices.pop();
  } else if (serviceCount < serviceLimit) {
    // Create a new service.
    serviceCount += 1;
    return newService(spec);
  } else {
    // Wait for a service to become available.
    return new Promise((resolve, reject) => pending.push(resolve));
  }
};

export const releaseService = async (spec, service) => {
  if (pending.length > 0) {
    // Send it directly to someone who needs it.
    pending.unshift()(service);
  } else if (idleServices.length < idleServiceLimit) {
    // Recycle the service.
    idleServices.push(service);
  } else {
    // Drop the service.
    serviceCount -= 1;
  }
};

export const getServicePoolInfo = async () => ({
  serviceCount,
  serviceLimit,
  idleServiceLimit,
  idleServiceCount: idleServices.length,
  pendingCount: pending.length,
});
