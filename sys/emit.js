const modules = [];

export const getModule = () => modules[modules.length - 1];

export const popModule = () => modules.pop();

export const pushModule = (module) => modules.push(module);

export const emitted = [];

let context;

let startTime = new Date();

export const elapsed = () => new Date() - startTime;

export const clearEmitted = () => {
  startTime = new Date();
  emitted.length = 0;
  context = undefined;
};

const onEmitHandlers = new Set();

export const emit = (value) => {
  if (value.module === undefined) {
    value.module = getModule();
  }
  if (value.setContext) {
    context = value.setContext;
  }
  if (context) {
    value.context = context;
  }
  const index = emitted.length;
  emitted.push(value);
  for (const onEmitHandler of onEmitHandlers) {
    onEmitHandler(value, index);
  }
};

export const getEmitted = () => [...emitted];

export const addOnEmitHandler = (handler) => {
  onEmitHandlers.add(handler);
  return handler;
};

export const removeOnEmitHandler = (handler) => onEmitHandlers.delete(handler);

export const info = (text) => emit({ info: text });
