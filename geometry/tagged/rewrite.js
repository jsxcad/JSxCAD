export const rewriteUp = (geometry, op) => {
  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    if (geometry.assembly) {
      return op({
        ...geometry,
        assembly: geometry.assembly.map(walk)
      });
    } else if (geometry.disjointAssembly) {
      return op({
        ...geometry,
        disjointAssembly: geometry.disjointAssembly.map(walk)
      });
    } else if (geometry.connection) {
      return op({
        ...geometry,
        geometries: geometry.geometries.map(walk),
        connectors: geometry.connectors.map(walk)
      });
    } else if (geometry.item) {
      return op({
        ...geometry,
        item: walk(geometry.item)
      });
    } else if (geometry.paths) {
      return op(geometry);
    } else if (geometry.plan) {
      return op(geometry);
    } else if (geometry.points) {
      return op(geometry);
    } else if (geometry.solid) {
      return op(geometry);
    } else if (geometry.surface) {
      return op(geometry);
    } else if (geometry.untransformed) {
      return op({
        ...geometry,
        untransformed: walk(geometry.untransformed)
      });
    } else if (geometry.z0Surface) {
      return op(geometry);
    } else {
      throw Error('die: Unknown geometry');
    }
  };

  return walk(geometry);
};
