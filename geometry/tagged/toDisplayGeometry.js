import { soup } from './soup.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

export const toDisplayGeometry = (geometry, options) =>
  soup(toDisjointGeometry(geometry), options);
