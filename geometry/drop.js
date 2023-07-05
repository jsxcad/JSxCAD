import { ghost } from './ghost.js';
import { on } from './on.js';

export const drop = (geometry, selector) => on(geometry, selector, ghost);
