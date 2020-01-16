const shallowEq = (a, b) => {
  if (a === undefined) throw Error('die');
  if (b === undefined) throw Error('die');
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

// Remove any symbols (which refer to cached values).
const clean = (geometry) => {
  const cleaned = {};
  for (const key of Object.keys(geometry)) {
    if (typeof key !== 'symbol') {
      cleaned[key] = geometry[key];
    }
  }
  return cleaned;
};

// Rewrite on the way back up the call-path.
export const rewriteUp = (geometry, op, traverseItem = true) => {
  // FIX: Minimize identity churn.
  const walk = (geometry) => {
    const q = (postopGeometry) => {
      if (postopGeometry === undefined) {
        return geometry;
      } else if (postopGeometry === geometry) {
        return geometry;
      } else {
        return clean(postopGeometry);
      }
    };

    if (geometry.assembly) {
      const assembly = geometry.assembly.map(walk);
      if (shallowEq(assembly, geometry.assembly)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, assembly }));
      }
    } else if (geometry.disjointAssembly) {
      const disjointAssembly = geometry.disjointAssembly.map(walk);
      if (shallowEq(disjointAssembly, geometry.disjointAssembly)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, disjointAssembly }));
      }
    } else if (geometry.layers) {
      const layers = geometry.layers.map(walk);
      if (shallowEq(layers, geometry.layers)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, layers }));
      }
    } else if (geometry.connection) {
      const geometries = geometry.geometries.map(walk);
      const connectors = geometry.connectors.map(walk);
      if (shallowEq(geometries, geometry.geometries) &&
          shallowEq(connectors, geometry.connectors)) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, geometries, connectors }));
      }
    } else if (geometry.item) {
      const item = traverseItem ? walk(geometry.item) : geometry.item;
      if (item === geometry.item) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, item }));
      };
    } else if (geometry.paths) {
      return q(op(geometry));
    } else if (geometry.plan) {
      return q(op(geometry));
    } else if (geometry.points) {
      return q(op(geometry));
    } else if (geometry.solid) {
      return q(op(geometry));
    } else if (geometry.surface) {
      return q(op(geometry));
    } else if (geometry.untransformed) {
      const untransformed = walk(geometry.untransformed);
      if (untransformed === geometry.untransformed) {
        return q(op(geometry));
      } else {
        return q(op({ ...geometry, untransformed }));
      }
    } else if (geometry.z0Surface) {
      return q(op(geometry));
    } else {
      throw Error('die: Unknown geometry');
    }
  };

  return walk(geometry);
};
