const tasks = [];

// Add task to complete before using system.
// Note: These are expected to be idempotent.
export const onBoot = (op) => {
  tasks.push(op);
};

const UNBOOTED = 'unbooted';
const BOOTING = 'booting';
const BOOTED = 'booted';

let status = UNBOOTED;

const pending = [];

// Execute tasks to complete before using system.
export const boot = async () => {
  // No need to wait.
  if (status === BOOTED) {
    return;
  }
  if (status === BOOTING) {
    // Wait for the system to boot.
    return new Promise((resolve, reject) => {
      pending.push(resolve);
    });
  }
  // Initiate boot.
  status = BOOTING;
  for (const task of tasks) {
    await task();
  }
  // Complete boot.
  status = BOOTED;
  // Release the pending clients.
  while (pending.length > 0) {
    pending.pop()();
  }
};
