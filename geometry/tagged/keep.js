import { rewriteTags } from './rewriteTags.js';

export const keep = (tags, geometry) =>
  rewriteTags(['compose/non-positive'], [], geometry, tags, 'has not');
