const pending = [];

export const addPending = (promise) => pending.push(promise);

export const resolvePending = async () => {
  while (pending.length > 0) {
    await pending.pop();
  }
};
