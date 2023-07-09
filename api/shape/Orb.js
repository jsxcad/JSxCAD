import Shape from './Shape.js';
import { Orb as op } from '@jsxcad/geometry';

// TODO: Consider re-enabling caching.

export const Orb = Shape.registerMethod3('Orb', ['intervals', 'options'], op);
