const shallowEq = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

export const rewriteUp = (geometry, op) => {
  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    if (geometry.assembly) {
      const assembly = geometry.assembly.map(walk);
      if (shallowEq(assembly, geometry.assembly)) {
        return op(geometry);
      } else {
        return op({ ...geometry, assembly });
      }
    } else if (geometry.disjointAssembly) {
      const disjointAssembly = geometry.disjointAssembly.map(walk);
      if (shallowEq(disjointAssembly, geometry.disjointAssembly)) {
        return op(geometry);
      } else {
        return op({ ...geometry, disjointAssembly });
      }
    } else if (geometry.connection) {
      const geometries = geometry.geometries.map(walk);
      const connectors = geometry.connectors.map(walk);
      if (shallowEq(geometries, geometry.geometries) &&
          shallowEq(connectors, geometry.connectors)) {
        return op(geometry);
      } else {
        return op({ ...geometry, geometries, connectors });
      }
    } else if (geometry.item) {
      const item = walk(geometry.item);
      if (item === geometry.item) {
        return op(geometry);
      } else {
        return op({ ...geometry, item });
      };
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
      const untransformed = walk(geometry.untransformed);
      if (untransformed === geometry.untransformed) {
        return geometry;
      } else {
        return op({ ...geometry, untransformed });
      }
    } else if (geometry.z0Surface) {
      return op(geometry);
    } else {
      throw Error('die: Unknown geometry');
    }
  };

  return walk(geometry);
};
