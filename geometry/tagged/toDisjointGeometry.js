import { difference } from './difference';
import { toTransformedGeometry } from './toTransformedGeometry';

const disjoint = Symbol('disjoint');

const toDisjointAssembly = (geometry) => {
  if (geometry.matrix) {
    // Transforming is identity-producing, so disjoint before transforming.
    return toTransformedGeometry({ ...geometry, untransformed: toDisjointGeometry(geometry.untransformed) });
  } else if (geometry[disjoint]) {
    return geometry[disjoint];
  } else if (geometry.item) {
    return { ...geometry, item: toDisjointAssembly(geometry.item) };
  } else if (geometry.connection) {
    return {
      ...geometry,
      connectors: geometry.connectors.map(toDisjointGeometry),
      geometries: geometry.geometries.map(toDisjointGeometry)
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
    const disjointAssembly = { disjointAssembly: disjoint };
    geometry[disjoint] = disjointAssembly;
    return disjointAssembly;
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
