export const eachItem = (geometry, operation) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      geometry.assembly.forEach(walk);
    }
    operation(geometry);
  }
  walk(geometry);
};
