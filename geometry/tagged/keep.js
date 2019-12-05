import { rewriteTags } from './rewriteTags';

export const keep = (tags, geometry) => rewriteTags(['compose/non-positive'], [], geometry, tags, 'has not');
