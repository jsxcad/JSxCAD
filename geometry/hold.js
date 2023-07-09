import { Group } from './Group.js';
import { inItem } from './inItem.js';
import { on } from './on.js';

export const hold = (geometry, geometries) =>
  on(geometry, inItem(geometry), (inside) => Group([inside, ...geometries]));
