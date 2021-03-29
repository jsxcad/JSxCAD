import { soup } from './soup.js';
import { toVisiblyDisjointGeometry } from './toDisjointGeometry.js';

export const toDisplayGeometry = (geometry, options) =>
  soup(toVisiblyDisjointGeometry(geometry), options);
