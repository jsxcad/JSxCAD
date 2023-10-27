import { by } from './by.js';
import { origin } from './origin.js';

// FIX: This really needs a better name.
export const flat = (geometry, reference = geometry) =>
  by(geometry, [origin(reference)]);
