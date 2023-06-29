import { alignment } from './alignment.js';
import { by } from './by.js';

export const align = (geometry, spec, origin) =>
  by(geometry, [alignment(geometry, spec, origin)]);
