export const map = (geometry, operation) => {
  const walk = (geometry) => {
    const updated = operation(geometry);
    if (updated.assembly) {
      updated.assembly = updated.assembly.map(walk);
    }
    return operation(geometry);
  }
  return walk(geometry);
};
