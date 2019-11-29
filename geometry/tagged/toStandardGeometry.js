// Produce a standard geometry representation without caches, etc.

export const toStandardGeometry = (geometry) => {
  const walk = (item) => {
    if (item.assembly) {
      return { assembly: item.assembly.map(walk), tags: item.tags };
    } else if (item.paths) {
      return { paths: item.paths, tags: item.tags };
    } else if (item.plan) {
      return { plan: item.plan, marks: item.marks, planes: item.planes, visualization: item.visualization, tags: item.tags };
    } else if (item.item) {
      return { item: item.item, tags: item.tags };
    } else if (item.solid) {
      return { solid: item.solid, tags: item.tags };
    } else if (item.surface) {
      return { surface: item.surface, tags: item.tags };
    } else if (item.z0Surface) {
      return { z0Surface: item.z0Surface, tags: item.tags };
    } else {
      throw Error('die');
    }
  };

  return walk(geometry);
};
