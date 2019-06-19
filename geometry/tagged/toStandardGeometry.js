// Produce a standard geometry representation without caches, etc.

export const toStandardGeometry = (geometry) => {
  const walk = (item) => {
    if (item.assembly) {
      return { assembly: item.assembly.map(walk), tags: item.tags };
    } else if (item.paths) {
      return { paths: item.paths, tags: item.tags };
    } else if (item.solid) {
      return { solid: item.solid, tags: item.tags };
    } else if (item.z0Surface) {
      return { z0Surface: item.z0Surface, tags: item.tags };
    } else {
      throw Error('die');
    }
  }

  return walk(geometry);
}
