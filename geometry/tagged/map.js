export const map = (geometry, operation) => {
  const present = item => item !== undefined;
  const walk = (geometry) => {
    if (geometry.assembly) {
      const assembly = geometry.assembly.map(walk).filter(present);
      return operation({ assembly, tags: geometry.tags });
    } else if (geometry.disjointAssembly) {
      // FIX: Consider the case where the operation does not preserve disjoinedness.
      const disjointAssembly = geometry.disjointAssembly.map(walk).filter(present);
      return operation({ disjointAssembly, tags: geometry.tags });
    } else {
      return operation(geometry);
    }
  };
  return walk(geometry);
};
