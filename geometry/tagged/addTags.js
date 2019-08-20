export const addTags = (tags, geometry, condition) => {
  const composeTags = (geometryTags) => {
    if (condition === undefined || condition(geometryTags)) {
      if (geometryTags === undefined) {
        return tags;
      } else {
        return [...tags, ...geometryTags];
      }
    } else {
      return geometryTags;
    }
  };

  const walk = (geometry) => {
    if (geometry.assembly) { return { assembly: geometry.assembly.map(walk) }; }
    if (geometry.disjointAssembly) { return { disjointAssembly: geometry.disjointAssembly.map(walk) }; }
    if (geometry.item) { return { item: geometry.item, tags: composeTags(geometry.tags) }; }
    if (geometry.paths) { return { paths: geometry.paths, tags: composeTags(geometry.tags) }; }
    if (geometry.points) { return { points: geometry.points, tags: composeTags(geometry.tags) }; }
    if (geometry.solid) { return { solid: geometry.solid, tags: composeTags(geometry.tags) }; }
    if (geometry.surface) { return { surface: geometry.surface, tags: composeTags(geometry.tags) }; }
    if (geometry.untransformed) { return { untransformed: walk(geometry.untransformed), matrix: geometry.matrix }; }
    if (geometry.z0Surface) { return { z0Surface: geometry.z0Surface, tags: composeTags(geometry.tags) }; }
    throw Error('die');
  };

  return walk(geometry);
};
