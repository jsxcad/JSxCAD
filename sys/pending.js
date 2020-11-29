const pending = [];

let pendingErrorHandler = (error) => console.log(error);

export const addPending = (promise) => pending.push(promise);

export const resolvePending = async () => {
  while (pending.length > 0) {
    await pending.pop();
  }
};

export const getPendingErrorHandler = () => pendingErrorHandler;
export const setPendingErrorHandler = (handler) => {
  pendingErrorHandler = handler;
};
