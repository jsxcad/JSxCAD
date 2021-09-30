import { rewriteTags } from './rewriteTags.js';

// Dropped elements displace as usual, but are not included in positive output.

export const drop = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has');
