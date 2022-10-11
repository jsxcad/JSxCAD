const sourceLocations = [];

export const getSourceLocation = () =>
  sourceLocations[sourceLocations.length - 1];

export const emitGroup = [];

let startTime = new Date();

export const elapsed = () => new Date() - startTime;

export const clearEmitted = () => {
  startTime = new Date();
  sourceLocations.splice(0);
};

export const saveEmitGroup = () => {
  const savedSourceLocations = [...sourceLocations];
  sourceLocations.splice(0);

  const savedEmitGroup = [...emitGroup];
  emitGroup.splice(0);

  return { savedSourceLocations, savedEmitGroup };
};

export const restoreEmitGroup = ({ savedSourceLocations, savedEmitGroup }) => {
  sourceLocations.splice(0, sourceLocations.length, ...savedSourceLocations);
  emitGroup.splice(0, emitGroup.length, ...savedEmitGroup);
};

const onEmitHandlers = new Set();

export const emit = (value) => {
  if (value.sourceLocation === undefined) {
    value.sourceLocation = getSourceLocation();
  }
  emitGroup.push(value);
};

export const addOnEmitHandler = (handler) => {
  onEmitHandlers.add(handler);
  return handler;
};

export const beginEmitGroup = (sourceLocation) => {
  if (emitGroup.length !== 0) {
    throw Error('emitGroup not empty');
  }
  sourceLocations.push(sourceLocation);
  emit({ beginSourceLocation: sourceLocation });
};

export const flushEmitGroup = () => {
  for (const onEmitHandler of onEmitHandlers) {
    const group = [...emitGroup];
    let nth = 0;
    for (const entry of group) {
      if (entry.sourceLocation) {
        entry.sourceLocation.nth = ++nth;
      }
    }
    onEmitHandler(group);
  }
  emitGroup.splice(0);
};

export const finishEmitGroup = (sourceLocation) => {
  if (sourceLocations.length === 0) {
    throw Error(`Expected current sourceLocation but there was none.`);
  }
  const endSourceLocation = getSourceLocation();
  if (
    sourceLocation.path !== endSourceLocation.path ||
    sourceLocation.id !== endSourceLocation.id
  ) {
    throw Error(
      `Expected sourceLocation ${JSON.stringify(
        sourceLocation
      )} but found ${JSON.stringify(endSourceLocation)}`
    );
  }
  emit({ endSourceLocation });
  sourceLocations.pop();
  flushEmitGroup();
};

export const removeOnEmitHandler = (handler) => onEmitHandlers.delete(handler);
