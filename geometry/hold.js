import { Group } from './Group.js';

export const hold = (geometry, geometries) => {
  if (geometry.type === 'item') {
    // FIX: Should use a better abstraction.
    return {
      ...geometry,
      content: [Group([geometry.content[0], ...geometries])],
    };
  } else {
    return Group([geometry, ...geometries]);
  }
};
