import { update } from './update';

export const rewrite = (geometry, op) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      return op(
        geometry,
        (changes) =>
          update(geometry, { assembly: geometry.assembly.map(walk) }, changes),
        walk
      );
    } else if (geometry.disjointAssembly) {
      return op(
        geometry,
        (changes) =>
          update(
            geometry,
            {
              disjointAssembly: geometry.disjointAssembly.map(walk),
            },
            changes
          ),
        walk
      );
    } else if (geometry.layers) {
      return op(
        geometry,
        (changes) =>
          update(geometry, { layers: geometry.layers.map(walk) }, changes),
        walk
      );
    } else if (geometry.item) {
      return op(
        geometry,
        (changes) => update(geometry, { item: walk(geometry.item) }, changes),
        walk
      );
    } else if (geometry.paths) {
      return op(geometry, (changes) => update(geometry, changes), walk);
    } else if (geometry.plan) {
      return op(
        geometry,
        (changes) =>
          update(geometry, { content: walk(geometry.content) }, changes),
        walk
      );
    } else if (geometry.points) {
      return op(geometry, (changes) => update(geometry, changes), walk);
    } else if (geometry.solid) {
      return op(geometry, (changes) => update(geometry, changes), walk);
    } else if (geometry.surface) {
      return op(geometry, (changes) => update(geometry, changes), walk);
    } else if (geometry.untransformed) {
      return op(
        geometry,
        (_) =>
          update(geometry, { untransformed: walk(geometry.untransformed) }),
        walk
      );
    } else if (geometry.z0Surface) {
      return op(geometry, (changes) => update(geometry, changes), walk);
    } else {
      throw Error('die: Unknown geometry');
    }
  };
  return walk(geometry);
};

export const visit = (geometry, op) => {
  const walk = (geometry) => {
    if (geometry.assembly) {
      op(geometry, (_) => geometry.assembly.forEach(walk));
    } else if (geometry.disjointAssembly) {
      op(geometry, (_) => geometry.disjointAssembly.forEach(walk));
    } else if (geometry.layers) {
      op(geometry, (_) => geometry.layers.forEach(walk));
    } else if (geometry.item) {
      op(geometry, (_) => walk(geometry.item));
    } else if (geometry.paths) {
      op(geometry, (_) => undefined);
    } else if (geometry.plan) {
      op(geometry, (_) => {
        walk(geometry.content);
      });
    } else if (geometry.points) {
      op(geometry, (_) => undefined);
    } else if (geometry.solid) {
      op(geometry, (_) => undefined);
    } else if (geometry.surface) {
      op(geometry, (_) => undefined);
    } else if (geometry.untransformed) {
      op(geometry, (_) => walk(geometry.untransformed));
    } else if (geometry.z0Surface) {
      op(geometry, (_) => undefined);
    } else {
      throw Error('die: Unknown geometry');
    }
  };
  walk(geometry);
};
