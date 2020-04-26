import { difference } from './difference';
import { rewrite } from './visit';
import { toTransformedGeometry } from './toTransformedGeometry';

const linkDisjointAssembly = Symbol('linkDisjointAssembly');

export const toDisjointGeometry = (geometry) => {
  const op = (geometry, descend) => {
    if (geometry[linkDisjointAssembly]) {
      return geometry[linkDisjointAssembly];
    } else if (geometry.disjointAssembly) {
      // Everything below this point is disjoint.
      return geometry;
    } else if (geometry.matrix) {
      return rewrite(toTransformedGeometry(geometry), op);
    } else if (geometry.assembly) {
      const assembly = geometry.assembly.map(entry => rewrite(entry, op));
      const disjointAssembly = [];
      for (let i = assembly.length - 1; i >= 0; i--) {
        disjointAssembly.unshift(difference(assembly[i], ...disjointAssembly));
      }
      const disjointed = { disjointAssembly };
      geometry[linkDisjointAssembly] = disjointed;
      return disjointed;
    } else {
      return descend();
    }
  };
  // FIX: Interleave toTransformedGeometry into this rewrite.
  if (geometry.disjointAssembly) {
    return geometry;
  } else {
    const disjointed = rewrite(geometry, op);
    if (disjointed.disjointAssembly) {
      geometry[linkDisjointAssembly] = disjointed;
      return disjointed;
    } else {
      const wrapper = { disjointAssembly: [disjointed] };
      geometry[linkDisjointAssembly] = wrapper;
      return wrapper;
    }
  }
};

/*
const disjointAssembly = Symbol('disjointAssembly');

const toDisjointAssembly = (geometry) => {
  if (geometry.matrix) {
    // Transforming is identity-producing, so disjoint before transforming.
    return toTransformedGeometry({ ...geometry, untransformed: toDisjointGeometry(geometry.untransformed) });
  } else if (geometry[disjointAssembly]) {
    return geometry[disjointAssembly];
  } else if (geometry.item) {
    return { ...geometry, item: toDisjointAssembly(geometry.item) };
  } else if (geometry.connection) {
    return {
      ...geometry,
      connectors: geometry.connectors.map(toDisjointGeometry),
      geometries: geometry.geometries.map(toDisjointGeometry)
    };
  } else if (geometry.layers) {
    return {
      ...geometry,
      layers: geometry.layers.map(toDisjointGeometry)
    };
  } else if (geometry.plan) {
    return {
      ...geometry,
      content: toDisjointGeometry(geometry.content)
    };
  } else if (geometry.assembly) {
    if (geometry.assembly.length === 0) {
      return { disjointAssembly: [] };
    }
    if (geometry.assembly.length === 1) {
      return toDisjointAssembly(geometry.assembly[0]);
    }
    const disjoint = [];
    for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
      const item = toDisjointAssembly(geometry.assembly[nth]);
      if (item !== undefined) {
        disjoint.unshift(difference(item, ...disjoint));
      }
    }
    if (disjoint.length === 0) {
      return;
    }
    const result = { disjointAssembly: disjoint };
    geometry[disjointAssembly] = result;
    return result;
  } else {
    return geometry;
  }
};

export const toDisjointGeometry = (inputGeometry) => {
  const disjointAssembly = toDisjointAssembly(inputGeometry);
  if (disjointAssembly === undefined) {
    return { disjointAssembly: [] };
  } else {
    return disjointAssembly;
  }
};
*/
