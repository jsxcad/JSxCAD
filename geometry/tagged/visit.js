import { update } from './update.js';

export const replacer = (from, to, limit = from.length) => {
  // We need to consider the case that there are duplicates in from.
  const update = (geometry, descend) => {
    for (let nth = 0; nth < limit; nth++) {
      if (from[nth] === geometry) {
        // Prevent this from being matched twice.
        from[nth] = undefined;
        return to[nth];
      }
    }
    return descend();
  };
  return (geometry) => rewrite(geometry, update);
};

const validateContent = (geometry, content) => {
  if (content && content.some((value) => !value)) {
    for (const v of content) {
      console.log(`QQ/content: ${v}`);
    }
    throw Error(
      `Invalid content: ${JSON.stringify(geometry, (k, v) =>
        !v ? `<# ${v} #>` : v
      )} ${JSON.stringify(content, (k, v) => (!v ? `<# ${v} #>` : v))}`
    );
  }
  return content;
};

export const rewrite = (geometry, op, state) => {
  const walk = (geometry, state) => {
    if (geometry.content) {
      return op(
        geometry,
        (changes, newState = state) =>
          update(
            geometry,
            {
              content: validateContent(
                geometry,
                geometry.content?.map?.((entry) => walk(entry, newState))
              ),
            },
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
      if (geometry.content.some((x) => x === undefined)) {
        throw Error(`Bad geometry: ${JSON.stringify(geometry)}`);
      }
      return op(
        geometry,
        (state) =>
          geometry.content?.forEach((geometry) => walk(geometry, state)),
        state
      );
    } else {
      return op(geometry, (state) => undefined, state);
    }
  };
  return walk(geometry, state);
};
