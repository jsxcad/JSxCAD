export const dispatch = (name, ...dispatches) => {
  return (...params) => {
    for (const dispatch of dispatches) {
      // For each signature
      let operation;
      try {
        // Try to decode it into an operation.
        operation = dispatch(...params);
      } catch (e) {
        continue;
      }
      return operation();
    }
    throw Error(`Unsupported interface for ${name}: ${JSON.stringify(params)}`);
  };
};
