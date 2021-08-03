import hashSum from 'hash-sum';

const sourceLocations = [];

export const getSourceLocation = () =>
  sourceLocations[sourceLocations.length - 1];

export const popSourceLocation = () => {
  emit({ endSourceLocation: getSourceLocation() });
  sourceLocations.pop();
};

export const pushSourceLocation = (sourceLocation) => {
  sourceLocations.push(sourceLocation);
  emit({ beginSourceLocation: sourceLocation });
};

export const emitted = [];

let startTime = new Date();

export const elapsed = () => new Date() - startTime;

export const clearEmitted = () => {
  startTime = new Date();
  emitted.length = 0;
  sourceLocations.length = 0;
};

const onEmitHandlers = new Set();

export const emit = (value) => {
  if (value.sourceLocation === undefined) {
    value.sourceLocation = getSourceLocation();
  }
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

export const info = (text) => {
  const entry = { info: text };
  const hash = hashSum(entry);
  emit({ info: text, hash });
};
