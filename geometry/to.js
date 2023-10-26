import { by } from './by.js';
import { origin } from './origin.js';

export const to = (geometry, target, connector = geometry) => {
  const oriented = by(geometry, [origin(connector)]);
  return by(oriented, [target]);
};
