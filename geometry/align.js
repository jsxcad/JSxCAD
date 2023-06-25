import { alignment } from './alignment.js';
import { by } from './by.js';

export const align = (geometry, spec) =>
  by(geometry, [alignment(geometry, spec)]);
