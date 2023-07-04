import { Group } from './Group.js';
import { by } from './by.js';
import { origin } from './origin.js';

export const to = (geometry, references) => {
  const atOrigin = by(geometry, [origin(geometry)]);
  const collected = [];
  for (const reference of references) {
    collected.push(by(atOrigin, [reference]));
  }
  return Group(collected);
};
