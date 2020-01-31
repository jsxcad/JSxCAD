const tasks = [];

// Add task to complete before using system.
// Note: These are expected to be idempotent.
export const onBoot = (op) => {
  tasks.push(op);
};

// Execute tasks to complete before using system.
export const boot = async () => {
  for (const task of tasks) {
    await task();
  }
};
