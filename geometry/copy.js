import { Group } from './Group.js';

export const copy = (geometry, count) => {
  const copies = [];
  for (let nth = 0; nth < count; nth++) {
    copies.push(geometry);
  }
  return Group(copies);
};
