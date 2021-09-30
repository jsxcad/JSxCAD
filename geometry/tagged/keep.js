import { rewriteTags } from './rewriteTags.js';

export const keep = (tags, geometry) =>
  rewriteTags(['type:void'], [], geometry, tags, 'has not');
