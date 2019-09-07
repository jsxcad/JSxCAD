export const eachItem = (geometry, operation) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    } else if (geometry.item) {
      walk(geometry.item);
    } else if (geometry.disjointAssembly) {
      geometry.disjointAssembly.forEach(walk);
      if (geometry.nonNegative) {
        geometry.nonNegative.forEach(walk);
      }
    }
    operation(geometry);
  };
  walk(geometry);
};
