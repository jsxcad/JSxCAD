export const emitted = [];

export const clearEmitted = () => {
  emitted.length = 0;
};

const onEmitHandlers = new Set();

export const emit = (value) => {
  emitted.push(value);
  for (const onEmitHandler of onEmitHandlers) {
    onEmitHandler(value);
  }
};

export const getEmitted = () => [...emitted];

export const addOnEmitHandler = (handler) => {
  onEmitHandlers.add(handler);
  return handler;
};

export const removeOnEmitHandler = (handler) => onEmitHandlers.delete(handler);
