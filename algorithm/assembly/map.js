export const map = (geometry, operation) => {
  const walk = (geometry, updated) => {
    for (const item of geometry.assembly) {
      if (item.assembly !== undefined) {
        updated.assembly.push(walk(item, { assembly: [], tags: item.tags }));
      } else {
        updated.assembly.push(operation(item));
      }
    }
    return updated;
  };
  return walk(geometry, { assembly: [], tags: geometry.tags });
};
