import { update } from './update';

export const rewrite = (geometry, op, state) => {
  const walk = (geometry, state) => {
    if (geometry.content) {
      return op(
        geometry,
        (changes, state) =>
          update(
            geometry,
            { content: geometry.content && geometry.content.map((entry) => walk(entry, state)) },
            changes
          ),
        walk,
        state
      );
    } else {
      return op(geometry, (changes) => update(geometry, changes), walk, state);
    }
  };
  return walk(geometry, state);
};

export const visit = (geometry, op, state) => {
  const walk = (geometry, state) => {
    if (geometry.content) {
      return op(geometry, (_) => geometry.content && geometry.content.forEach(walk), state);
    } else {
      return op(geometry, (_) => undefined, state);
    }
  };
  return walk(geometry, state);
};
