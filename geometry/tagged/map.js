export const map = (geometry, operation) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      return operation({ assembly: geometry.assembly.map(walk), tags: geometry.tags });
    } else {
      return operation(geometry);
    }
  };
  return walk(geometry);
};
